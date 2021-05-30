import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import topSvg from './top-arrow-circle.svg'

const textResouce = {
    Chinese: {
        "tip": "請輸入四位數",
        "Great": "你好棒!",
        "Bed": "你好廢!",
        "RightAnswer": "正確答案是 : ",
        "Count": ", 回答次數 : ",
        "Restart": "重新遊戲",
        "Close": "關閉視窗",
        "Confirm": "確認",
        "BackSpace": "刪除",
        "GiveUp": "放棄",
        "Step": "次數",
        "Answer": "答案",
        "Result": "結果"
    },
    English: {
        "tip": "Please input 4 numbers",
        "Great": "Well done!",
        "Bed": "You suck!",
        "RightAnswer": "The right answer is : ",
        "Count": ", counts : ",
        "Restart": "Restart",
        "Close": "Close",
        "Confirm": "Confirm",
        "BackSpace": "BackSpace",
        "GiveUp": "GiveUp",
        "Step": "Step",
        "Answer": "Answer",
        "Result": "Result"
    }
}

const Modal = ({
    title,
    content,
    modalShow,
    onCloseModal,
    button
}) => {
    return (
        <>
            <div className={"modal " + (modalShow ? "modalShow" : "")} onClick={onCloseModal}>
                <div className="modal-dialog">
                    <div className="modal-content" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button className="close" onClick={onCloseModal}>
                                <span>
                                    x
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                {content}
                            </p>
                        </div>
                        <div className="modal-footer">
                            {
                                button
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


function App() {
    const [lan, setLan] = useState("Chinese");
    const [value, setValue] = useState("");
    const [steps, setSteps] = useState([]);
    const [stepActive, setStepActive] = useState(null);
    const [answer, setAnswer] = useState([]);
    const [bingo, setBingo] = useState(false);
    const [grayBgShow, setGrayBgShow] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [editAlertShow, setEditAlertShow] = useState(false);
    const historyBottom = useRef();
    const history = useRef();

    const onLanChange = (e) => {
        setLan(e.target.value);
    }

    const findText = (key) => {
        return textResouce[lan][key];
    }

    const confirmAnswer = () => {
        if (value.length === 4) {
            addHistory(checkAnswer());
            setValue("");
        } else {
            setEditAlertShow(true);
        }
    }

    const backspace = () => {
        setValue(value.substring(0, value.length - 1));
    }

    const restart = () => {
        if (!bingo)
            setModalTitle(findText("Bed"))
        else
            setModalTitle(findText("Great"));
        onShowModal();
    }

    const gameBingo = () => {
        setBingo(true);
        setModalTitle(findText("Great"));
        onShowModal();
    }

    const restartGame = () => {
        onCloseModal();
        generateAnswer();
        setEditAlertShow(false);
        setBingo(false);
        setStepActive(null);
        setSteps([]);
        setValue("");
    }

    const onShowModal = () => {
        setGrayBgShow(true);
        setModalShow(true);
    }

    const onCloseModal = () => {
        setGrayBgShow(false);
        setModalShow(false);
    }

    const onInputChange = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        let array = v.split('');
        if (value.length <= 4)
            setValue(array.filter((ele, pos) => array.indexOf(ele) === pos).join(''));
    }

    const onNumberClick = (e) => {
        let num = e.target.getAttribute("value");
        if (value.indexOf(num) < 0 && value.length < 4) {
            setValue(value + num)
        }
    }

    const onScrollTop = () => {
        history.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const addHistory = ({ a, b }) => {
        let array = [...steps];
        array.push({ answer: value, state: `${a}A${b}B` });
        setSteps(array);
    }

    const checkAnswer = () => {
        let guess = value.split('');
        let a = 0;
        let b = 0;
        answer.forEach((num, i) => {
            if (guess[i] === num) {
                a = a + 1;
            } else if (answer.indexOf(guess[i]) >= 0) {
                b = b + 1;
            }
        });
        return { a: a, b: b };
    }

    const generateAnswer = () => {
        let numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let Answer = [];
        for (var i = 0; i < 4; i++) {
            var n = Math.floor(Math.random() * numArray.length);
            Answer.push(numArray[n].toString());
            numArray.splice(n, 1);
        }
        setAnswer(Answer);
    }

    useEffect(() => {
        setEditAlertShow(false);
    }, [value]);

    useEffect(() => {
        if (steps.length > 0) {
            historyBottom.current.scrollIntoView({ behavior: 'smooth' });
            if (steps[steps.length - 1].answer === answer.join("")) {
                gameBingo();
            }
        }
    }, [steps, answer]);

    useEffect(() => {

        generateAnswer();
    }, []);

    return (
        <>
            <Modal title={modalTitle} content={`${findText("RightAnswer") + answer.join("") + findText("Count") + steps.length}`} modalShow={modalShow} onCloseModal={onCloseModal} button={<>
                <div className="button" onClick={restartGame}>{findText("Restart")}</div>
                <div className="button" onClick={onCloseModal}>{findText("Close")}</div>
            </>} />
            <div className="wrapper">
                <select value={lan} onChange={onLanChange}>
                    <option value="Chinese">中文</option>
                    <option value="English">English</option>
                </select>
                <div className="edit">
                    <div className="edit-right">
                        <div className={"button" + (bingo ? " disabled" : "")} onClick={bingo ? null : confirmAnswer}>{findText("Confirm")}</div>
                        <div className="button" onClick={backspace}>{findText("BackSpace")}</div>
                        <div className="button" onClick={restart}>{findText("GiveUp")}</div>
                    </div>
                    <div className="edit-left">
                        <div className={"edit-alert" + (editAlertShow ? " edit-alertShow" : "")}>
                            {findText("tip")}
                        </div>
                        <input type="text" className={"edit-input" + (editAlertShow ? " edit-alertOutline" : "")} value={value} maxLength="4" disabled={bingo} onChange={bingo ? null : onInputChange} onFocus={() => {
                            setEditAlertShow(false);
                        }} />
                    </div>

                </div>
                <div className="numbers">
                    {
                        Array(10).fill().map((v, i) => i).map(i => {
                            return <div key={i} className={"number" + (bingo ? " disabled" : "")} value={i} onClick={bingo ? null : onNumberClick}>{i}</div>
                        })
                    }
                </div>
                <div className="history" ref={history}>
                    <div className="step step-first">
                        <div className="step-count">
                            {findText("Step")}
                        </div>
                        <div className="step-answer">
                            {findText("Answer")}
                        </div>
                        <div className="step-state">
                            {findText("Result")}
                        </div>
                    </div>
                    {
                        steps.map(({ answer, state }, i) => {
                            return <div key={i} className={"step" + (stepActive === i ? " stepActive" : "")} onClick={()=>{
                                setStepActive(i);
                            }}>
                                <div className="step-count">
                                    {i + 1}
                                </div>
                                <div className="step-answer">
                                    {answer}
                                </div>
                                <div className="step-state">
                                    {state}
                                </div>
                            </div>
                        })
                    }
                    <div ref={historyBottom}></div>
                </div>
                <img src={topSvg} alt="scrollTop" className="scrollTop" onClick={onScrollTop} />
            </div>
            <div className={"grayBg " + (grayBgShow ? "grayBgShow" : "")}></div>
        </>
    );
}

export default App;
