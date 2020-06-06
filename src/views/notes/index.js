/* eslint-disable no-undef */
/* eslint-disable */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { ValidatorForm } from 'react-form-validator-core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextValidator, customHooks } from '../../helpers'
import { Form, Col, Button } from 'react-bootstrap';
import CommonTable from '../../components/table'
import { setAlertMsg } from '../../helpers/common'
import AlertBox from '../../components/alert'
import moment from 'moment'
import { getDiff } from '../../getDifference';

//importing GET/POST/PUT/DELETE request from sevices
import { getRequest, postRequest, deleteRequest, putRequest } from '../../services/index'

//importing API endpoint from constant
import { TEST_NOTES } from '../../constant';

//import confirm modal box
import ConfirmModal from './confirmModal';

const thead = ['Date', 'Username', 'Note', 'Time', 'Action']

const Notes = () => {

    const initialState = {
        note: "",
        selectNote: "",
        time: ''
    };



    //[Declaring useState for displaying purposes]
    //Storing response from TEST_NOTES
    const [responseWithNoteInfo, setNoteInfo] = useState([]);

    //Storing ID from table 
    const [getRowId, setRowId] = useState('')

    const [status, setStatus] = useState(0)

    //show modal 
    const [showModal, setShowModal] = useState(false)

    const [disabled, setDisabled] = useState(false)

    //displaying success and error on the screen 
    const [succErrMsg, setSuccErrMsg] = useState({});

    //Digital Watch
    const [getDigitalTime, setDigitalTime] = useState('');

    //Setting up done task
    const [getDone, setDone] = useState('');

    //timer-time
    const [getTime, setTime] = useState('');

    //get id from element
    const [getActionId, setActionId] = useState('add')

    const handleSave = async (e) => {

        if (getActionId === "add") {

            //function to add data from POST_TEST_NOTES Apiendpoint
            try {

                var Time = new Date(inputs.time);
                var TIME = moment(Time).format("HH:mm:ss");
                var CURRENT_TIME = new Date().toLocaleTimeString('en-US', { hour12: false });
                if (TIME > CURRENT_TIME) {

                    //Parsing body  
                    const sendData = {
                        notes: inputs.note,
                        time: TIME,
                        done: '0'
                    };
                    setStatus(1);

                    //all data in result variable(calling api named POST_TEST_NOTES)
                    const result = await postRequest(TEST_NOTES, sendData);

                    //Destructuring the object
                    const { status, msg } = result;

                    if (status) {
                        setStatus(0);
                        getRequestForNotes();
                        resetState();
                        setAlertMsg(msg, "success", setSuccErrMsg, 4000);
                    }
                    else {
                        setStatus(0);
                        setAlertMsg(msg, "danger", setSuccErrMsg, 4000);
                    }
                } else {
                    setAlertMsg('Time should be greater than current time', "danger", setSuccErrMsg, 4000);
                }

            } catch (error) {
                const { response } = error;
                setAlertMsg('Something went wrong!! Please try again later', "danger", setSuccErrMsg, 4000);
            }
        }
        else if (getActionId === 'update') {

            //function to add data from PUT_TEST_NOTES Apiendpoint
            try {
                var TIME = typeof inputs.time == 'object' ? moment(new Date(inputs.time)).format("HH:mm:ss") : getTime;
                var CURRENT_TIME = new Date().toLocaleTimeString('en-US', { hour12: false })

                if (TIME >= CURRENT_TIME) {
                    //Parsing body
                    const sendData = {
                        id: getRowId,
                        notes: inputs.note,
                        time: TIME,
                        done: '0'
                    };
                    setStatus(1);

                    //all data in result variable(calling api named TEST_NOTES)
                    const result = await putRequest(TEST_NOTES, sendData);

                    //Destructuring the object
                    const { status, msg } = result;

                    if (status) {
                        setStatus(0);
                        getRequestForNotes();
                        setAlertMsg(msg, "success", setSuccErrMsg, 4000);
                        getIdFromElement('add');
                        resetState();
                    } else {
                        setStatus(0);
                        setAlertMsg(msg, "danger", setSuccErrMsg, 4000);
                    }
                }
                else {
                    setAlertMsg('Time should be greater than current time', "danger", setSuccErrMsg, 4000);
                }

            } catch (error) {
                setAlertMsg('Something went wrong!! Please try again later', "danger", setSuccErrMsg, 4000);
            }
        }

    }

    //function to get data from note Apiendpoint
    const getRequestForNotes = async () => {
        try {

            //all data in result variable(calling api named note)
            const result = await getRequest(TEST_NOTES);
            if (result.data.length === 0) {
                setInputs(inputs => ({
                    ...inputs,
                    ...initialState
                }));
                getIdFromElement(event = 'add')
            }
            //Destructuring the object
            const { status, data, msg } = result;

            //data is not equal to null
            if (data != null) {

                //status is equal to true
                if (status) {
                    const descendingData = data.reverse()
                    setNoteInfo(descendingData)
                }
            }
            else {
                const { msg } = result;
                setAlertMsg(msg, "danger", setSuccErrMsg, 4000)
            }

        } catch (error) {
            setAlertMsg('Something went wrong!! Please try again later', "danger", setSuccErrMsg, 4000)
        }
    }

    //calling function to get API call 
    useEffect(() => {
        setInterval(() => {
            setDigitalTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
        }, 1000);
        getRequestForNotes();
    }, [])

    // function to get prefield
    const handleChange = (row) => {

        //scroll to top after clicking SelectNote button
        window.scrollTo(100, 0)
        var CURRENT_TIME = new Date().toLocaleTimeString('en-US', { hour12: false })
        if (row.time > CURRENT_TIME) {
            setInterval(() => {
                checkAlarm(row.time, row.notes);
            }, 1000)
        }

        //storing rowId in rowID state
        setRowId(row.id)
        setTime(row.time)
        setDone(row.done)

        //inputs prefield
        setInputs(inputs => ({
            ...inputs,
            note: row.notes,
            added_on: row.added_on,
            user_name: row.user_name,
            time: row.time,
            done: row.done
        }));
    }

    //function to hide modal over delete button
    const hideModal = () => {
        setShowModal(false)
    }


    //getting previous state
    const resetState = async () => {
        setInputs(inputs => ({
            ...inputs,
            ...initialState
        }))
    }

    const handleRowId = (row) => {
        setRowId(row)
    }
    const checkAlarm = async (time, notes) => {
        let CURRENT_TIME = new Date().toLocaleTimeString('en-US', { hour12: false })
        let diff = getDiff(time, CURRENT_TIME)
        if (time === CURRENT_TIME) {
            setDone('1');
            toast.info('Its Time !!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

            let sendData = {
                id: getRowId,
                done: '1',
                notes: notes,
                time: time
            }
            await putRequest(TEST_NOTES, sendData);
            if (status) {
                getRequestForNotes();
            }

        } else if (diff === 300) {
            toast.info('Reminder!!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

        }
        else {
            console.log('not yet')
        }
    }

    //function to remove Note
    const deleteNotes = async () => {
        try {
            //Parsing body
            const sendData = {
                id: getRowId
            }

            //all data in result variable(calling api named note)
            const result = await deleteRequest(TEST_NOTES, sendData);

            //Destructuring the object
            const { status, msg } = result;
            if (status) {
                getRequestForNotes();
                setShowModal(false)
                resetState()
                setAlertMsg(msg, "success", setSuccErrMsg, 4000)
            }
            else {
                setAlertMsg(msg, "danger", setSuccErrMsg, 4000)
                setShowModal(false)
                resetState()
            }
        } catch (error) {
            setAlertMsg('Something went wrong!! Please try again later', "danger", setSuccErrMsg, 4000)
        }
    }

    const { inputs, handleInputChange, handleSubmit, setInputs } = customHooks(initialState, handleSave)

    //displaying table with status=1 [GET TEST_NOTES]
    const successOnFetchingNotes = (
        <div style={{ marginTop: '15px' }}>
            <CommonTable className="action-list table-selected" thead={thead} >
                {responseWithNoteInfo && responseWithNoteInfo.map((v, k) => {
                    return (
                        <tr className={v.id == getRowId ? "row-selected" : null} key={v.id}>
                            <td style={{
                                cursor: 'pointer',
                                textDecoration: ((getDone === '1' && v.id == getRowId) || v.done === "1") ? "line-through" : "none"
                            }}>{v.added_on}</td>
                            <td style={{
                                cursor: 'pointer',
                                textDecoration: ((getDone === '1' && v.id == getRowId) || v.done === "1") ? "line-through" : "none"
                            }}>{v.user_name}</td>
                            <td style={{
                                cursor: 'pointer',
                                textDecoration: ((getDone === '1' && v.id == getRowId) || v.done === "1") ? "line-through" : "none",
                                whiteSpace: "pre-wrap"
                            }}>{v.notes}</td>
                            <td style={{
                                cursor: 'pointer',
                                textDecoration: ((getDone === '1' && v.id == getRowId) || v.done === "1") ? "line-through" : "none",
                                whiteSpace: "pre-wrap"
                            }}>{v.time}</td>
                            <td>
                                <button className="check-icon-btn" onClick={() => { handleChange(v); getIdFromElement('updatex') }}>
                                </button>
                                <Button size="sm" className="fa-button" variant="outline-secondary" onClick={() => { handleRowId(v.id); setShowModal(true) }}>
                                    <i className="fa fa-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </CommonTable>
        </div>
    )

    // switch add button to update on click of button named Select note
    const getIdFromElement = (event) => {
        setActionId(event)
    }

    //button for add note
    const addNotes = (
        <Button type="submit" variant="primary" id="add" onClick={() => { getIdFromElement('add'); }} disabled={status === 1 ? true : false}>Add</Button>
    )

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;

    return (
        <div>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover />
            {
                <ValidatorForm onSubmit={handleSubmit}>
                    <ConfirmModal hideModal={hideModal} show={showModal} title="Are you sure you want to remove this record ?"  >
                        <div>
                            <Button type="submit" variant="primary" onClick={() => { deleteNotes(); resetState(); getIdFromElement('add') }} disabled={disabled} >Yes</Button>
                            <Button variant="outline-secondary" onClick={() => { setShowModal(false) }}>Cancel</Button>
                        </div>
                    </ConfirmModal>

                    {succErrMsg && succErrMsg.msg &&
                        <AlertBox msg={succErrMsg.msg} variant={succErrMsg.variant} />
                    }

                    <div style={{ textAlign: 'center' }}>
                        <b style={{ fontSize: '20px' }}>{today}</b>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <b style={{ fontSize: '20px' }}>{getDigitalTime}</b>
                    </div>

                    <Form.Row>
                        <Form.Group as={Col} md={12}>
                            <TextValidator label="Note" onChange={(event) => handleInputChange(event, 'inputTextArea')} name="note" as="textarea" id="" cols="50" rows="5" style={{ border: "solid 1px lightgray" }}
                                rows="3" value={inputs.note} validators={['required']} errorMessages={['This filed is required']} />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <TextValidator
                                label="Time"
                                flatpickr={true}
                                name="time"
                                dateformat="H:i:s"
                                enabletime="true"
                                nocalendar="true"
                                placeholder="hh:mm:ss"
                                onChange={handleInputChange}
                                value={inputs.time}
                                validators={['required']}
                                errorMessages={['This filed is required']}
                            />
                        </Form.Group>
                    </Form.Row>

                    {(getActionId === 'add') ? addNotes : (
                        <div>
                            <Button type="submit" variant="primary" id="update" onClick={() => getIdFromElement('update')} disabled={status === 1 ? true : false}>Update</Button>
                            <Button variant="outline-secondary" onClick={() => { { resetState(); getIdFromElement('add') } }}>Cancel</Button>
                        </div>
                    )}

                    {responseWithNoteInfo.length ? successOnFetchingNotes : <div style={{ marginTop: '20px', textAlign: 'center' }}><b>"There are no records to display"</b></div>}

                </ValidatorForm>
            }
        </div>
    );
}

export default Notes;





