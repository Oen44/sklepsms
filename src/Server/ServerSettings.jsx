import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { serverStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';

class ServerSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSet: false,
            ipError: false,
            name: null,
            ip_address: null
        };
        this.MapMenu = this.MapMenu.bind(this);
        this.NameHandle = this.NameHandle.bind(this);
        this.IpHandle = this.IpHandle.bind(this);
        this.SaveSettings = this.SaveSettings.bind(this);
    }

    componentWillMount() {
        if (serverStore.getState().length <= 0) {
            let th = this;
            serverStore.getServerData(function (data) {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
    }

    NameHandle(e) {
        this.setState({ inputSet: true, name: e.target.value.trim() });
    }

    IpHandle(e) {
        this.setState({ inputSet: true, ip_address: e.target.value.trim() });
    }

    SaveSettings(e) {
        let th = this;
        let id = this.props.match.params.id;
        let server = serverStore.getState();
        server = server[id];
        let name = this.state.name || server.name;
        let ip = this.state.ip_address || server.ip_address;
        let regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{5})$/g;

        if (!regex.test(ip)) {
            this.setState({ ipError: true });
        } else {
            this.setState({ ipError: false });
            axios
                .post(
                    Config.urls.serverSettings,
                    qs.stringify({
                        id: id,
                        name: name,
                        ip: ip
                    })
                )
                .then(response => {
                    LogToDatabase(
                        'Change server settings ' + id + ' ' + name + ' ' + ip
                    );
                    serverStore.getServerData(function (data) {
                        th.setState(prev => {
                            return (th.state = prev);
                        });
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    MapMenu(props) {
        let serverInfo = [];
        let serverID = props.serverId;
        serverInfo.push(props.info[props.serverId]);

        if (serverInfo[0] === undefined) {
            return (
                <div className="BFPMQ6-Z-a" data-hidden="false">
                    <div className="BFPMQ6-k-Q BFPMQ6-k-t">
                        <span className="BFPMQ6-l-K BFPMQ6-Z-b" />
                    </div>
                </div>
            );
        }

        const server_name = serverInfo.map(server => (
            <div
                className="BWPQWAD-k-s BWPQWAD-m-l BWPQWAD-Tg-D"
                key={server.id}
            >
                {server.name}
            </div>
        ));

        const creation_date = serverInfo.map(server => (
            <span
                className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s"
                key={server.id}
            >
                {server.creation_date}
            </span>
        ));

        const server_page = serverInfo.map(server => (
            <span style={{ color: '#84a000' }} key={server.id}>
                {server.web_page}
            </span>
        ));

        const ip_address = serverInfo.map(server => (
            <span key={server.id}>{server.ip_address}</span>
        ));

        let button, ipError;

        if (this.state.inputSet) {
            button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                    type="button"
                    onClick={this.SaveSettings}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        } else {
            button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r BWPQWAD-f-f"
                    type="button"
                    disabled
                >
                    <div className="BWPQWAD-f-m">Zapisane</div>
                </button>
            );
        }

        if (this.state.ipError) {
            ipError = (
                <div className="alert alert-danger">
                    Podane IP nie jest poprawne!
                </div>
            );
        }

        return (
            <div className="BWPQWAD-N-a" id="gwt-uid-252">
                <div className="BWPQWAD-m-i">
                    <div className="BWPQWAD-Tg-g">
                        <header className="BWPQWAD-k-v">
                            <div className="BWPQWAD-m-d BWPQWAD-Tg-k">
                                <div className="BWPQWAD-Tg-i">
                                    {server_name}
                                    <div className="BWPQWAD-Tg-e">
                                        {creation_date}
                                        <span className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s">
                                            <NavLink
                                                to={'/#'}
                                                onClick={this.DeleteServer}
                                            >
                                                Usuń serwer
                                            </NavLink>
                                        </span>
                                    </div>
                                    <div className="BWPQWAD-Tg-y BWPQWAD-k-s">
                                        <span className="BWPQWAD-Tg-x">
                                            {server_page}
                                        </span>
                                        {ip_address}
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>
                    <div>
                        <div className="BWPQWAD-n-a">
                            <sidebar className="BWPQWAD-p-c BWPQWAD-B-c">
                                <nav>
                                    <ol>
                                        <li>
                                            <NavLink
                                                to={`/ServerDashboard/${serverID}`}
                                            >
                                                <span>Statystyki</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to={`/ServerServices/${serverID}`}
                                            >
                                                <span>Usługi</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to={`/ServerIncome/${serverID}`}
                                            >
                                                <span>Raporty Przychodów</span>
                                            </NavLink>
                                        </li>
                                        <li className="BWPQWAD-n-f">
                                            <NavLink
                                                to={`/ServerSettings/${serverID}`}
                                                onClick={e =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <span>Ustawienia</span>
                                            </NavLink>
                                        </li>
                                    </ol>
                                </nav>
                            </sidebar>
                            <aside />
                            <div id="gwt-uid-254">
                                <div className="BWPQWAD-Eh-a">
                                    <div className="BWPQWAD-Gl-b">
                                        <div
                                            className="BWPQWAD-P-d"
                                            data-title-type="CARD"
                                        >
                                            <h3>Ustawienia Serwera</h3>
                                            {button}
                                        </div>
                                        <section>
                                            <fieldset className="BWPQWAD-j-f">
                                                <label>
                                                    <div>
                                                        <p className="BWPQWAD-j-i">
                                                            Nazwa serwera
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <div className="BWPQWAD-Am-a">
                                                                <input
                                                                    className="gwt-TextBox BWPQWAD-Am-d"
                                                                    dir="ltr"
                                                                    type="text"
                                                                    defaultValue={
                                                                        serverInfo[0]
                                                                            .name
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .NameHandle
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="BWPQWAD-j-h">
                                                            Nazwa serwera na
                                                            liście.
                                                        </p>
                                                    </div>
                                                </label>

                                                <label>
                                                    <div>
                                                        <p className="BWPQWAD-j-i">
                                                            Adres IP
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <div className="BWPQWAD-Am-a">
                                                                <input
                                                                    className="gwt-TextBox BWPQWAD-Am-d"
                                                                    dir="ltr"
                                                                    type="text"
                                                                    defaultValue={
                                                                        serverInfo[0]
                                                                            .ip_address
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .IpHandle
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="BWPQWAD-j-h">
                                                            Adres IP z portem
                                                            serwera.
                                                        </p>
                                                    </div>
                                                </label>
                                                {ipError}
                                            </fieldset>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <this.MapMenu
                serverId={this.props.match.params.id}
                info={serverStore.getState()}
            />
        );
    }
}

export default ServerSettings;
