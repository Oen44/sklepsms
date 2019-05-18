import React, { Component } from 'react';
import Config from '../Utils/Config';
import { serverStore, LogToDatabase } from '../App';

import axios from 'axios';
import qs from 'qs';

class AddNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web_page: null,
            nextStep: false,
            verifyStep: false,
            verifySuccess: false
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.InputHandle = this.InputHandle.bind(this);
        this.NextStep = this.NextStep.bind(this);
        this.VerifyNetwork = this.VerifyNetwork.bind(this);
        this.SaveNetwork = this.SaveNetwork.bind(this);
        this.GetNetworks = this.GetNetworks.bind(this);
        this.CheckNetExists = this.CheckNetExists.bind(this);
        this.GenerateFile = this.GenerateFile.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(function (data) {
                th.setState(
                    prev => {
                        return (th.state = prev);
                    },
                    () => {
                        th.GetNetworks();
                        th.componentDidMount();
                    }
                );
            });
        } else {
            this.GetNetworks();
        }
    }

    componentDidMount() {
        if (Config.network.net_id) {
            this.props.history.push('/');
        }
    }

    GenerateFile(data, callback) {
        axios
            .post(
                Config.urls.generateVerifyFile,
                qs.stringify({
                    web_page: data
                })
            )
            .then(function (response) {
                if (typeof callback === 'function') callback(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    GetNetworks() {
        let th = this;
        axios
            .post(Config.urls.getNetworksNames)
            .then(response => {
                th.setState({
                    networks: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    CheckNetExists(web_page) {
        web_page = web_page.toLowerCase();
        web_page = web_page.endsWith('/') ? web_page.slice(0, -1) : web_page;
        const exists = this.state.networks.includes(web_page);
        this.setState({
            netExists: exists
        });
    }

    InputHandle(e) {
        let th = this;
        let web_page = e.target.value;
        web_page = web_page.replace('http://', '');
        web_page = web_page.replace('https://', '');
        web_page = web_page.replace('www.', '');
        web_page = web_page.replace(/\/+$/, '');
        web_page = web_page.trim();
        if (web_page.length > 4) {
            this.setState(
                {
                    web_page: web_page
                },
                th.CheckNetExists(web_page)
            );
        } else {
            this.setState({
                web_page: null,
                nextStep: false,
                verifyStep: false,
                netExists: false
            });
        }
    }

    NextStep(e) {
        this.setState(
            {
                verifyStep: true
            },
            () => {
                this.GenerateFile(this.state.web_page.toLowerCase(), response => {
                    this.setState({
                        file: response.data
                    });
                });
            }
        );
    }

    VerifyNetwork(e) {
        let th = this;
        axios
            .post(
                Config.urls.verifyNetwork,
                qs.stringify({
                    url:
                        'http://' +
                        this.state.web_page.toLowerCase() +
                        '/' +
                        this.state.file +
                        '.php'
                })
            )
            .then(function (response) {
                if (response.data === th.state.file) {
                    th.setState({
                        verifySuccess: true,
                        verifyFail: false
                    });
                } else {
                    th.setState({
                        verifySuccess: false,
                        verifyFail: true
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
                th.setState({
                    verifySuccess: false,
                    verifyFail: true
                });
            });
    }

    SaveNetwork(e) {
        let th = this;
        axios
            .post(
                Config.urls.addNetwork,
                qs.stringify({
                    user_id: Config.user_id,
                    web_page: th.state.web_page.toLowerCase()
                })
            )
            .then(response => {
                LogToDatabase('Add network ' + th.state.web_page.toLowerCase());
                window.location.reload();
                //serverStore.getServerData(th.props.history.push('/'));
            })
            .catch(error => {
                console.log(error);
            });
    }

    RenderContent(props) {
        let save_button, nextStep, verifyStep, success, fail;

        if (!this.state.verifySuccess) {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r BWPQWAD-f-f"
                    disabled
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
            success = null;
            if (this.state.verifyFail) {
                fail = (
                    <div className="alert alert-danger">
                        Weryfikacja nie powiodła się, spróbuj ponownie lub
                        wyślij raport i opisz problem.
                    </div>
                );
            } else if (this.state.netExists) {
                fail = (
                    <div className="alert alert-danger">
                        Sieć o podanej nazwie jest już dodana.
                    </div>
                );
            } else {
                fail = null;
            }
        } else {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                    onClick={this.SaveNetwork}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
            success = (
                <div className="alert alert-success">
                    Weryfikacja przebiegła pomyślnie, sieć może być teraz
                    dodana.
                </div>
            );
        }

        if (this.state.web_page) {
            nextStep = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                    onClick={this.NextStep}
                >
                    <div className="BWPQWAD-f-m">Dalej</div>
                </button>
            );
        } else {
            nextStep = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r BWPQWAD-f-f"
                    disabled
                >
                    <div className="BWPQWAD-f-m">Dalej</div>
                </button>
            );
        }

        if (this.state.verifyStep && this.state.file) {
            verifyStep = (
                <label>
                    <div>
                        <p className="BWPQWAD-j-i"> Weryfikacja sieci </p>
                    </div>
                    <div>
                        <div>
                            <div className="BWPQWAD-Am-a">
                                <button
                                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                                    onClick={this.VerifyNetwork}
                                >
                                    <div className="BWPQWAD-f-m">Sprawdź</div>
                                </button>
                            </div>
                        </div>
                        <p className="BWPQWAD-j-h">
                            Pobierz plik{' '}
                            <strong>
                                <a
                                    href={`https://sklepsms.pl/verify/verify.php?id=${this.state.web_page.toLowerCase()}`}
                                >
                                    {this.state.file}.php
                                </a>
                            </strong>{' '}
                            i wgraj do głównego katalogu strony (http://{
                                this.state.web_page
                            }/{this.state.file}.php) a następnie kliknij
                            przycisk "Sprawdź" w celu weryfikacji sieci.
                        </p>
                    </div>
                </label>
            );
        } else {
            verifyStep = null;
        }

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Dodawanie Sieci
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Nazwa sieci </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                type="text"
                                                onChange={this.InputHandle}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Nazwa sieci (strona) potrzebna do
                                        identyfikacji.
                                    </p>
                                    {nextStep}
                                </div>
                            </label>
                            {verifyStep}
                            {success}
                            {fail}
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

export default AddNetwork;
