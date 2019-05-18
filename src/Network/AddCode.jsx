import React, { Component } from 'react';
import { serverStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';
import $ from 'jquery';

class AddCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSet: false,
            value: 1
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.SendAdd = this.SendAdd.bind(this);
        this.CodeChange = this.CodeChange.bind(this);
        this.ValueChange = this.ValueChange.bind(this);
        this.GenerateCode = this.GenerateCode.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(function (data) {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
    }

    CodeChange(e) {
        this.setState({
            inputSet: true,
            code: e.target.value.trim()
        });
    }

    ValueChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    GenerateCode() {
        const code = [...Array(8)].map(() => Math.random().toString(36)[3]).join('').toUpperCase();
        $('#smsCode').val(code);
        this.setState({
            inputSet: true,
            code: code
        });
    }

    SendAdd() {
        const th = this;
        const net_id = Config.network.net_id;
        const code = this.state.code;
        const value = this.state.value;

        let error = false;

        if (!code || code.length < 1) {
            this.setState({ errorCode: 'To pole nie może być puste' });
            error = true;
        } else if (code.length > 16) {
            this.setState({
                errorCode: 'Przekroczono maksymalną ilość znaków'
            });
            error = true;
        } else this.setState({ errorCode: null });

        if (!error) {
            axios
                .post(
                    Config.urls.addCode,
                    qs.stringify({
                        net_id: net_id,
                        code: code,
                        value: value
                    })
                )
                .then(response => {
                    LogToDatabase('Add SMS Code ' + code + ' #' + net_id);
                    th.props.history.push('/NetworkCodes');
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    RenderContent(props) {
        let save_button;

        if (!this.state.inputSet) {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r BWPQWAD-f-f"
                    disabled
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        } else {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                    onClick={this.SendAdd}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        let errorCode;

        if (this.state.errorCode) {
            errorCode = (
                <div className="alert alert-danger">
                    {this.state.errorCode}
                </div>
            );
        }

        const prices = Config.prices.map(price => (
            <option value={price.id} key={price.id}>
                {price.value}
            </option>
        ));

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Dodawanie kodu SMS
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Kod SMS </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                id="smsCode"
                                                dir="ltr"
                                                type="text"
                                                maxLength="16"
                                                onChange={this.CodeChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        <button className="BWPQWAD-In-be" onClick={this.GenerateCode}>Wygeneruj losowy 8-znakowy kod.</button>
                                    </p>
                                    {errorCode}
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Wartosć </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <select
                                                className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                                                onChange={this.ValueChange}
                                            >
                                                {prices}
                                            </select>
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Cena jakiej odpowiadać będzie ten kod.
                                    </p>
                                </div>
                            </label>
                        </fieldset>
                    </section>
                </div>
            </div>
        );
    }

    render() {
        return <this.RenderContent />;
    }
}

export default AddCode;
