import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { serverStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';
import $ from 'jquery';

class ServerServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            services: []
        };
        this.MapMenu = this.MapMenu.bind(this);
        this.DeleteService = this.DeleteService.bind(this);
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

        axios
            .post(
                Config.urls.getServices,
                qs.stringify({
                    s_id: th.props.match.params.id
                })
            )
            .then(response => {
                th.setState({
                    services: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentDidMount() {
        let th = this;
        (() => {
            $('#editService').off('click');

            $('#editService').on('click', () => {
                th.EditService();
            });
        })();
    }

    DeleteService(e) {
        let data = e.target.dataset;
        let id = data.id;
        let title = data.title;

        let th = this;
        axios
            .post(
                Config.urls.deleteService,
                qs.stringify({
                    id: id
                })
            )
            .then(response => {
                LogToDatabase('Delete service ' + id + ' ' + title);
                axios
                    .post(
                        Config.urls.getServices,
                        qs.stringify({
                            s_id: th.props.match.params.id
                        })
                    )
                    .then(response => {
                        th.setState({
                            services: response.data
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    MapMenu(props) {
        let serverInfo = [];
        let serverID = props.serverId;
        serverInfo.push(props.info[props.serverId]);
        let services = this.state.services;

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

        const list = services.map(service => (
            <tr key={service.ss_id}>
                <td>{service.service_id}</td>
                <td>{service.service_title}</td>
                <td>{service.service_description}</td>
                <td>{service.service_suffix}</td>
                <td>
                    <NavLink
                        className="btn btn-success"
                        to={`/EditServerService/${service.ss_id}`}
                    >
                        {' '}
                        <i className="fa fa-pencil" /> Edytuj
                    </NavLink>
                    <button
                        className="btn btn-danger"
                        onClick={this.DeleteService}
                        data-id={service.ss_id}
                        data-title={service.service_title}
                    >
                        <i className="fa fa-trash" /> Usuń
                    </button>
                </td>
            </tr>
        ));

        const addButton = (
            <button
                className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-g BWPQWAD-f-r"
                onClick={() =>
                    this.props.history.push(
                        `/AddServerService/${this.props.match.params.id}`
                    )
                }
            >
                <div className="BWPQWAD-f-m">
                    <i className="fa fa-plus BWPQWAD-l-cb" />
                    <span className="BWPQWAD-k-u">Dodaj usługe</span>
                </div>
            </button>
        );

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
                                <div>{addButton}</div>
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
                                        <li className="BWPQWAD-n-f">
                                            <NavLink
                                                to={`/ServerServices/${serverID}`}
                                                onClick={e =>
                                                    e.preventDefault()
                                                }
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
                                        <li>
                                            <NavLink
                                                to={`/ServerSettings/${serverID}`}
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
                                        <section>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Tytuł</th>
                                                        <th>Opis</th>
                                                        <th>Suffix</th>
                                                        <th>Opcje</th>
                                                    </tr>
                                                </thead>
                                                <colgroup>
                                                    <col
                                                        style={{
                                                            width: 10 + '%'
                                                        }}
                                                    />
                                                    <col
                                                        style={{
                                                            width: 13 + '%'
                                                        }}
                                                    />
                                                    <col
                                                        style={{
                                                            width: 15 + '%'
                                                        }}
                                                    />
                                                    <col
                                                        style={{
                                                            width: 12 + '%'
                                                        }}
                                                    />
                                                    <col
                                                        style={{
                                                            width: 10 + '%'
                                                        }}
                                                    />
                                                </colgroup>
                                                <tbody>{list}</tbody>
                                            </table>
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

export default ServerServices;
