import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Config from '../Utils/Config';
import {
    serverStore,
    LeaveNetworkDB,
    ChangeEmailDB,
    ChangePasswordDB
} from '../App';

class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = { inputSet: false, pass: null, repass: null };
        this.MapServers = this.MapServers.bind(this);
        this.EmailHandle = this.EmailHandle.bind(this);
        this.LeaveNetwork = this.LeaveNetwork.bind(this);
        this.SaveHandler = this.SaveHandler.bind(this);
        this.PasswordHandle = this.PasswordHandle.bind(this);
        this.RePasswordHandle = this.RePasswordHandle.bind(this);
    }

    componentWillMount() {
        const th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
    }

    EmailHandle(e) {
        let email = e.target.value.trim();
        if (!email) email = Config.email;
        this.setState({
            inputSet: true,
            email: email
        });
    }

    PasswordHandle(e) {
        let pass = e.target.value.trim();
        if (!pass) pass = null;
        this.setState({
            inputSet: true,
            pass: pass
        });
    }

    RePasswordHandle(e) {
        let pass = e.target.value.trim();
        if (!pass) pass = null;
        this.setState({
            inputSet: true,
            repass: pass
        });
    }

    LeaveNetwork(e) {
        LeaveNetworkDB(Config.user_id, () => {
            window.location.reload();
        });
    }

    SaveHandler(e) {
        let pass = this.state.pass;
        let repass = this.state.repass;
        let email = this.state.email;
        let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

        if (pass && repass) {
            if (pass !== repass) {
                this.setState({ passError: true });
            } else {
                if (!regex.test(email)) {
                    this.setState({ emailError: true });
                } else {
                    ChangePasswordDB(pass, () => {
                        ChangeEmailDB(email, () => {
                            if (Config.build)
                                window.location =
                                    'https://sklepsms.pl/logout.php';
                        });
                    });
                }
            }
        } else if (email) {
            if (!regex.test(email)) {
                this.setState({ emailError: true });
            } else {
                ChangeEmailDB(email, () => {
                    window.location.reload();
                });
            }
        }
    }

    MapServers(props) {
        let save_button;

        if (!this.state.inputSet) {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r BWPQWAD-f-f"
                    disabled
                >
                    <div className="BWPQWAD-f-m">Zapisane</div>
                </button>
            );
        } else {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                    onClick={this.SaveHandler}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        let passError;
        if (this.state.passError) {
            passError = (
                <div className="alert alert-danger">Hasła się różnią!</div>
            );
        } else {
            passError = null;
        }

        let emailError;
        if (this.state.emailError) {
            emailError = (
                <div className="alert alert-danger">
                    Email jest niepoprawny!
                </div>
            );
        } else {
            emailError = null;
        }

        let partnership;
        if (Config.network.net_id && !Config.network.owner) {
            partnership = (
                <label>
                    <div>
                        <p className="BWPQWAD-j-i"> Partnerstwo </p>
                    </div>
                    <div>
                        <div>
                            <div className="BWPQWAD-Am-a">
                                <input
                                    className="gwt-TextBox BWPQWAD-Am-d"
                                    dir="ltr"
                                    type="text"
                                    autoComplete="off"
                                    value={Config.network.web_page || ''}
                                    disabled
                                />
                                <NavLink
                                    to={'/UserSettings'}
                                    onClick={this.LeaveNetwork}
                                >
                                    Zrzeknij się partnerstwa
                                </NavLink>
                            </div>
                        </div>
                        <p className="BWPQWAD-j-h">Konto przypisane do sieci</p>
                    </div>
                </label>
            );
        }

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Ustawienia Profilu
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i">Adres E-mail</p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="text"
                                                onChange={this.EmailHandle}
                                                value={Config.email || ''}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Adres e-mail potrzebny do kontaktu.
                                    </p>
                                    {emailError}
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Zmień Hasło </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="password"
                                                autoComplete="off"
                                                onChange={this.PasswordHandle}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Podaj nowe hasło.
                                    </p>
                                    {passError}
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="password"
                                                autoComplete="off"
                                                onChange={this.RePasswordHandle}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Powtórz nowe hasło.
                                    </p>
                                </div>
                            </label>
                            {partnership}
                        </fieldset>
                    </section>
                </div>
            </div>
        );
    }

    render() {
        return <this.MapServers />;
    }
}

export default UserSettings;
