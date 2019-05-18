import React, { Component } from 'react';
import Config from '../Utils/Config';
import { serverStore, AddServerDB } from '../App';

class AddServer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            ip_address: null,
            inputSet: false,
            error: null
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.NameChange = this.NameChange.bind(this);
        this.AddressChange = this.AddressChange.bind(this);
        this.Handler = this.Handler.bind(this);
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

    Handler(e) {
        let data = [];
        let th = this;
        data.net_id = Config.network.net_id;
        data.name = th.state.name;
        data.ip_address = th.state.ip_address;

        let regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{5})$/g;
        if (!regex.test(data.ip_address)) {
            this.setState({ ipError: true });
        } else {
            this.setState({ ipError: false });
            AddServerDB(data, error => {
                if (!error || error === null) th.props.history.push('/');
                else {
                    th.setState({
                        error: error
                    });
                }
            });
        }
    }

    NameChange(e) {
        this.setState({
            inputSet: true,
            name: e.target.value.trim()
        });
    }

    AddressChange(e) {
        this.setState({
            inputSet: true,
            ip_address: e.target.value.trim()
        });
    }

    RenderContent(props) {
        let save_button, error;

        if (this.state.error === 1062) {
            error = (
                <div className="alert alert-danger" role="alert">
                    <strong>Błąd!</strong>&nbsp;Serwer o podanym adresie IP już
                    istnieje.
                </div>
            );
        } else if (this.state.error != null) {
            error = (
                <div className="alert alert-warning" role="alert">
                    <strong>Uwaga!</strong>&nbsp;Wystąpił błąd numer&nbsp;
                    {this.state.error}. Prosimy napisać raport w tej sprawie.
                </div>
            );
        }

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
                    onClick={this.Handler}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        let ipError;
        if (this.state.ipError) {
            ipError = (
                <div className="alert alert-danger">
                    Podane IP nie jest poprawne!
                </div>
            );
        }

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Dodawanie Serwera
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        {error}
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i">Nazwa serwera</p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                onChange={this.NameChange}
                                                dir="ltr"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Nazwa serwera widoczna na liście w
                                        panelu.
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Własność </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="text"
                                                value={Config.network.web_page}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Należność serwera do sieci.
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Adres IP </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                onChange={this.AddressChange}
                                                dir="ltr"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Adres IP z portem serwera.
                                    </p>
                                </div>
                            </label>
                            {ipError}
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

export default AddServer;
