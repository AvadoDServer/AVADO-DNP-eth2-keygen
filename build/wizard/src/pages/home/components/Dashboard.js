import React from "react";
import axios from "axios";
import spinner from "../../../assets/spinner.svg";
import config from "../../../config";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import rhino from "../../../assets/rhino.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DownloadKeys from "./DownloadKeys.js";
import autobahn from "autobahn-browser";

const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

const Comp = () => {

    const [password, setPassword] = React.useState();
    const [verifyPassword, setVerifyPassword] = React.useState();
    const [amount, setAmount] = React.useState(1);
    const [progress, setProgress] = React.useState();
    const [generating, setGenerating] = React.useState(false);
    const [readyToGenerate, setReadyToGenerate] = React.useState(false);
    const [passwordFieldType, setPasswordFieldType] = React.useState("password");
    const [passwordFieldIcon, setPasswordFieldIcon] = React.useState(faEyeSlash);
    const [mnemonicLanguage, setMnemonicLanguage] = React.useState("english");
    const [cmdOutput, setCmdOutput] = React.useState();
    const [cmdShowOutput, setCmdShowOutput] = React.useState(false);
    const [wampSession, setWampSession] = React.useState();

    React.useEffect(() => {
        reset();
        const connection = new autobahn.Connection({
            url,
            realm
        });
        connection.onopen = session => {
            setWampSession(session);
        };
        // connection closed, lost or unable to connect
        connection.onclose = (reason, details) => {
            this.setState({ connectedToDAppNode: false });
            console.error("CONNECTION_CLOSE", { reason, details });
        };
        connection.open();
    }, []);

    React.useEffect(() => {
        if (password && password.length > 7 &&
            !isNaN(parseInt(amount)) &&
            parseInt(amount) > 0 &&
            password === verifyPassword &&
            !generating
        ) {
            setReadyToGenerate(true);
        } else {
            setReadyToGenerate(false);
        }
    }, [password, amount, verifyPassword, generating]);



    const reset = async () => {
        await axios.get(`${config.api.HTTP}/reset`).then((res) => {
            // 
        }).finally(() => {
            setCmdOutput(null);
            setPassword(null);
            setVerifyPassword(null);
            setPasswordFieldType("password");
        })
    }

    const toggleViewPassword = () => {
        const currentType = passwordFieldType;
        setPasswordFieldType(currentType === "password" ? "text" : "password");
        setPasswordFieldIcon(currentType === "password" ? faEye : faEyeSlash);
    }

    const generate = async (password, amount) => {
        if (generating) return;
        setGenerating(true);
        setProgress(`Running key generator.. Hang on to your socks! This might take a minute.`);
        await axios.post(`${config.api.HTTP}/mkkeys`, { language: mnemonicLanguage, password: password, amount: amount }, { timeout: 5 * 60 * 1000 }).then((res) => {
            setCmdOutput(res.data);
        })
        setGenerating(false);
    }

    const header = () => {
        return (
            <section className="keygen is-medium has-text-white">
                <div className="columns is-mobile">
                    <div className="column is-8-desktop is-10">

                        <h1 className="title is-1 is-spaced has-text-white">ETH2.0 Staking Key Generator</h1>
                        <p>This package allows you to generate staking keys for ETH2.0 on your local machine.</p>
                        <br />
                        <div className="columns">
                            <div className="column is-half ">
                                <h1 className="title is-3 has-text-white">How does this work?</h1>

                                <p>
                                    This package will generate exactly the same keys as if you were using the launchpad binary which
                                    you can later use to deposit on the Ethereum Launchpad & use these keys in the AVADO ETH2.0 Prysm client (or other clients)
                        </p><br />
                                <p>This is just a little more user friendly, and true to the AVADO spirit of making everything as easy as possible !</p>
                                <br />
                                <p>NOTE: After generating and downloading the keys - you can remove this package again. It is not required to run your validator. It is just a tool to easily generate ETH2.0 validator keys.</p>

                            </div>
                            <div className="column is-half">
                                <img src={rhino} />
                                <p className="has-text-centered help">Leslie the Launchpad Rhino (<a target="_blank" href="https://launchpad.ethereum.org/">source</a>)</p>
                            </div>
                        </div>
                        {!cmdOutput && (
                            <>
                                <div className="field">
                                    <label className="label">Staking key password</label>
                                    <p className="help">This is the password that will encrypt your keystore - minimum length  =  8 characters</p>
                                </div>
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <input className="input" type={passwordFieldType} onChange={(e) => { setPassword(e.target.value) }} />

                                    </div>
                                    <div className="control">
                                        <a onClick={toggleViewPassword} className="button is-link is-light"><FontAwesomeIcon

                                            className="icon is-small is-right avadoiconpadding"
                                            icon={passwordFieldIcon}
                                        />
                                        </a></div>


                                </div>

                                <div className="field">
                                    <label className="label">Verify Password</label>
                                    <div className="control">
                                        <input className="input" type={passwordFieldType} onChange={(e) => { setVerifyPassword(e.target.value) }} />
                                    </div>
                                    {password !== verifyPassword && (
                                        <p className="help is-danger">passwords do not match</p>
                                    )}
                                    {password && password.length > 0 && password === verifyPassword && (
                                        <p className="help is-success">passwords match :)</p>
                                    )}
                                </div>


                                <div className="field">
                                    <label className="label">Amount of keys to generate</label>
                                    <p className="help">This is the amount of times you want to stake 32 ETH</p>
                                    <div className="control">
                                        <input className="input" value={amount} type="text" onChange={(e) => { setAmount(e.target.value) }} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">mnemonic language</label>
                                    <div className="control">
                                        <div className="select">
                                            <select value={mnemonicLanguage} onChange={(e) => { setMnemonicLanguage(e.target.value) }}>
                                                <option>chinese_simplified</option>
                                                <option>chinese_traditional</option>
                                                <option>czech</option>
                                                <option>english</option>
                                                <option>italian</option>
                                                <option>korean</option>
                                                <option>spanish</option>

                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="field is-grouped">
                                    <div className="control">
                                        <button disabled={!readyToGenerate || generating} onClick={() => { generate(password, amount) }} className="button is-link is-light">Generate Keys</button>
                                    </div>
                                </div>
                            </>)}
                        {generating && (
                            <>
                                <p>{progress}</p>
                                <img alt="spinner" src={spinner} />
                            </>
                        )}

                        {cmdOutput &&
                            (
                                <>
                                    <h1 className="title is-3 has-text-white">Done!</h1>
                                    <p>
                                        We have created a zipfile for you containing
                                    <ul>
                                            <li>Your staking keys</li>
                                            <li>Your deposit file you can use on the <a target="_blank" href="https://launchpad.ethereum.org/">Ethereum Launchpad</a> to fund the validator account(s)</li>
                                            <li>A textfile containing the mnemonic phrase of your wallet (<b>back this up immediately!</b>)</li>
                                            <li>A textfile containing the password to decrypt your wallet (<b>back this up immediately!</b>)</li>
                                        </ul>
                                    </p>
                                    <br />
                                    <div className="field">

                                        <DownloadKeys session={wampSession}/>
                                    </div>
                                    <p><a onClick={() => { setCmdShowOutput(!cmdShowOutput) }} className=" is-small is-link">show a transcript of key generation</a></p>
                                    <br />
                                    <button onClick={() => { reset() }} className="button">Reset: wipe keys from package - and start over</button>
                                    {cmdShowOutput && (
                                        <>
                                            <br /><br />
                                            <pre className="transcript">
                                                {cmdOutput}
                                            </pre>
                                        </>
                                    )}
                                </>
                            )
                        }
                        <br />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            {header()}
        </>
    )


};

export default Comp;