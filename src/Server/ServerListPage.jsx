import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { serverStore } from '../App';
import Config from '../Utils/Config';

class ServerListPage extends Component {
    constructor(props) {
        super(props);
        this.state = { servers: [], serverInfo: [] };
        this.MapServers = this.MapServers.bind(this);
        this.FilterList = this.FilterList.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(function (data) {
                let serverInfo = [];
                for (let i in data) {
                    serverInfo.push(data[i]);
                }
                th.setState({
                    servers: data,
                    serverInfo: serverInfo
                });
            });
        }
    }

    componentDidMount() {
        let th = this;

        let serverInfo = [];
        let data = serverStore.getState();
        for (let i in data) {
            serverInfo.push(data[i]);
        }
        th.setState({
            servers: data,
            serverInfo: serverInfo
        });
    }

    FilterList(e) {
        let serverInfo = [];
        let servers = this.state.servers;

        for (let i in servers) {
            if (
                servers[i].name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                (Config.user_id === 1 &&
                    servers[i].web_page
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()))
            )
                serverInfo.push(servers[i]);
        }
        this.setState({
            serverInfo: serverInfo
        });
    }

    MapServers(props) {
        let serverInfo = this.state.serverInfo;
        let list;

        if (!Config.network.license || serverInfo.length <= 0) {
            list = (
                <div className="BWPQWAD-S-C">
                    <div className="BWPQWAD-S-d">Brak dodanych serwerów.</div>
                </div>
            );
        } else {
            let table = serverInfo.map(server => {
                let version = <div>
                    {server.shop_version_r === undefined ? (
                        <NavLink to={`/ServerDashboard/${server.id}`}><span>{server.shop_version}</span></NavLink>
                    ) : (
                            <span>
                                {server.shop_version}&nbsp;<NavLink title="Nowa Wersja" style={{ display: "inline", color: "#3366cc" }} to={'/Informations'}>({server.shop_version_r})</NavLink>
                            </span>
                        )}
                </div>
                return <tr className="BWPQWAD-Xc-b BFPMQ6-T-r" key={server.id}>
                    <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c BWPQWAD-Xc-d">
                        <div>
                            <NavLink
                                to={`/ServerDashboard/${server.id}`}
                                data-column="TITLE"
                            >
                                <span>{server.name}</span>
                            </NavLink>
                        </div>
                    </td>
                    {
                        Config.user_id === 1 ? (
                            <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                                <div>
                                    <NavLink to={`/ServerDashboard/${server.id}`}>
                                        <span>{server.web_page}</span>
                                    </NavLink>
                                </div>
                            </td>
                        ) : null
                    }
                    <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                        <div>
                            <NavLink to={`/ServerDashboard/${server.id}`}>
                                <span>{server.solds}</span>
                            </NavLink>
                        </div>
                    </td>
                    <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                        <div>
                            <NavLink to={`/ServerDashboard/${server.id}`}>
                                <span>{server.monthly + ' PLN'}</span>
                            </NavLink>
                        </div>
                    </td>
                    <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                        <div>
                            <NavLink to={`/ServerDashboard/${server.id}`}>
                                <span>{server.total + ' PLN'}</span>
                            </NavLink>
                        </div>
                    </td>
                    <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                        {version}
                    </td>
                </tr>
            });
            list = (
                <table className="BWPQWAD-t-T">
                    <thead>
                        <tr>
                            <th className="BWPQWAD-Xc-h">Nazwa Serwera</th>
                            {Config.user_id === 1 ? (
                                <th className="BWPQWAD-Xc-h">Nazwa Sieci</th>
                            ) : null}
                            <th className="BWPQWAD-Xc-h">Sprzedanych Usług</th>
                            <th className="BWPQWAD-Xc-h">
                                Przychód z miesiąca
                            </th>
                            <th className="BWPQWAD-Xc-h">Całkowity Przychód</th>
                            <th className="BWPQWAD-Xc-h">Wersja Serwera</th>
                        </tr>
                    </thead>
                    <colgroup>
                        <col style={{ width: 20 + '%' }} />
                        {Config.user_id === 1 ? (
                            <col style={{ width: 15 + '%' }} />
                        ) : null}
                        <col style={{ width: 13 + '%' }} />
                        <col style={{ width: 15 + '%' }} />
                        <col style={{ width: 12 + '%' }} />
                        <col style={{ width: 10 + '%' }} />
                    </colgroup>
                    <tbody>{table}</tbody>
                </table>
            );
        }
        let add_button;
        if (Config.network.license && Config.network.net_id > 0) {
            add_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                    onClick={() => this.props.history.push('/AddServer')}
                >
                    <div className="BWPQWAD-f-m">
                        <i className="fa fa-plus BWPQWAD-l-cb" />
                        <span className="BWPQWAD-k-u"> Dodaj serwer </span>
                    </div>
                </button>
            );
        } else {
            add_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r BWPQWAD-f-f"
                    title="Brak Licencji!"
                    disabled
                >
                    <div className="BWPQWAD-f-m">
                        <i className="fa fa-lock BWPQWAD-l-cb" />
                        <span className="BWPQWAD-k-u">Brak Licencji!</span>
                    </div>
                </button>
            );
        }

        return (
            <div>
                <div className="BWPQWAD-N-a">
                    <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                        <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                            <span style={{ verticalAlign: 'middle' }}>
                                Twoje serwery
                            </span>
                            <input
                                type="text"
                                className="gwt-TextBox BWPQWAD-Am-d"
                                style={{
                                    marginLeft: 15 + 'px',
                                    fontSize: 15 + 'px'
                                }}
                                placeholder="Szukaj serwera..."
                                onChange={this.FilterList}
                            />
                        </h2>
                        <div>{add_button}</div>
                    </header>
                    <div className="BWPQWAD-k-K">{list}</div>
                </div>
            </div>
        );
    }

    render() {
        return <this.MapServers />;
    }
}

export default ServerListPage;
