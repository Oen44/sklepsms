import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { serverStore } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';

class ServerIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            income: []
        };
        this.MapMenu = this.MapMenu.bind(this);
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
                Config.urls.getIncome,
                qs.stringify({
                    id: th.props.match.params.id
                })
            )
            .then(response => {
                th.setState({
                    income: response.data
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

        let incomeList,
            incomeTable,
            incomes = this.state.income;
        if (incomes.length < 1) {
            incomeTable = (
                <div className="BWPQWAD-S-C">
                    <div className="BWPQWAD-S-d">Brak przychodów.</div>
                </div>
            );
        } else {
            incomeList = incomes.map(i => (
                <tr key={i.id}>
                    <td>{i.date}</td>
                    <td>{i.player}</td>
                    <td>{i.sms_code}</td>
                    <td>{i.service_title}</td>
                    <td>{i.amount}</td>
                    <td>{i.cost + ' PLN'}</td>
                    <td>{i.income + ' PLN'}</td>
                </tr>
            ));
            incomeTable = (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Gracz</th>
                            <th>Kod SMS</th>
                            <th>Usługa</th>
                            <th>Ilość</th>
                            <th>Koszt</th>
                            <th>Przychód</th>
                        </tr>
                    </thead>
                    <tbody>{incomeList}</tbody>
                </table>
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
                                        <li className="BWPQWAD-n-f">
                                            <NavLink
                                                to={`/ServerIncome/${serverID}`}
                                                onClick={e =>
                                                    e.preventDefault()
                                                }
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
                                        <section>{incomeTable}</section>
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

export default ServerIncome;
