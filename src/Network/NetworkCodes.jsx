import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Config from '../Utils/Config';
import { serverStore, codeStore, DeleteNetworkDB, LogToDatabase } from '../App';
import axios from 'axios';
import qs from 'qs';

class NetworkCodes extends Component {
    constructor(props) {
        super(props);
        this.state = { codes: null };
        this.MapMenu = this.MapMenu.bind(this);
        this.DeleteNetwork = this.DeleteNetwork.bind(this);
        this.DeleteCode = this.DeleteCode.bind(this);
    }

    componentWillMount() {
        const th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                codeStore.getNetworkCodes(data => {
                    th.setState({
                        codes: data
                    });
                });
            });
        } else {
            codeStore.getNetworkCodes(data => {
                th.setState({
                    codes: data
                });
            });
        }
    }

    DeleteNetwork() {
        DeleteNetworkDB(() => {
            window.location.reload();
        });
    }

    DeleteCode(e) {
        let data = e.target.dataset;
        let id = data.id;
        axios
            .post(
                Config.urls.deleteCode,
                qs.stringify({
                    id: id
                })
            )
            .then(response => {
                LogToDatabase('Delete network SMS Code ' + id);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    MapMenu(props) {
        let content;
        const codes = this.state.codes;

        if (!Config.network.web_page) {
            content = (
                <div className="BWPQWAD-S-C">
                    <div className="BWPQWAD-S-d">
                        Brak przypisanej sieci do konta.<br />
                        <br />
                        <button
                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                            onClick={() =>
                                this.props.history.push('/AddNetwork')
                            }
                        >
                            <div className="BWPQWAD-f-m">
                                <i className="fa fa-plus BWPQWAD-l-cb" />
                                <span className="BWPQWAD-k-u">Dodaj sieć</span>
                            </div>
                        </button>
                    </div>
                </div>
            );
        } else {
            let deletebutton, list, table;
            if (Config.network.owner) {
                deletebutton = (
                    <span className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s">
                        <NavLink
                            to={'/#'}
                            data-toggle="modal"
                            data-target="#netModal"
                        >
                            Usuń sieć
                        </NavLink>
                    </span>
                );
            }

            if (codes && codes.length > 0 && Config.network.license) {
                list = codes.map(code => (
                    <tr key={code.id}>
                        <td>{code.code}</td>
                        <td>{Config.prices[code.value - 1].value}</td>
                        <td>{code.used_date !== null ? code.used_date : 'Brak'}</td>
                        <td>{code.player !== null ? code.player : 'Brak'}</td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={this.DeleteCode}
                                data-id={code.id}
                            >
                                <i className="fa fa-trash" /> Usuń
                            </button>
                        </td>
                    </tr>
                ));
                table = (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Kod SMS</th>
                                <th>Wartość</th>
                                <th>Data użycia</th>
                                <th>Gracz</th>
                                <th>Opcje</th>
                            </tr>
                        </thead>
                        <colgroup>
                            <col
                                style={{
                                    width: '20%'
                                }}
                            />
                            <col
                                style={{
                                    width: '20%'
                                }}
                            />
                            <col
                                style={{
                                    width: '20%'
                                }}
                            />
                            <col
                                style={{
                                    width: '20%'
                                }}
                            />
                            <col
                                style={{
                                    width: '20%'
                                }}
                            />
                            <col
                                style={{
                                    width: '20%'
                                }}
                            />
                        </colgroup>
                        <tbody>{list}</tbody>
                    </table>
                );
            }
            else {
                table = (
                    <div className="BWPQWAD-S-C">
                        <div className="BWPQWAD-S-d">Brak dodanych kodów.</div>
                    </div>
                );
            }

            content = (
                <div className="BWPQWAD-N-a" id="gwt-uid-252">
                    <div className="BWPQWAD-m-i">
                        <div className="BWPQWAD-Tg-g">
                            <header className="BWPQWAD-k-v">
                                <div className="BWPQWAD-m-d BWPQWAD-Tg-k">
                                    <div className="BWPQWAD-Tg-i">
                                        <div className="BWPQWAD-k-s BWPQWAD-m-l BWPQWAD-Tg-D">
                                            {Config.network.web_page + ' #' + Config.network.net_id}
                                        </div>
                                        <div className="BWPQWAD-Tg-e">
                                            <span className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s">
                                                {Config.network.date}
                                            </span>
                                            {deletebutton}
                                        </div>
                                        <div className="BWPQWAD-Tg-y BWPQWAD-k-s">
                                            <span className="BWPQWAD-Tg-x">
                                                <span
                                                    style={{
                                                        color: '#84a000',
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    {'Właściciel: ' + Config.network.ownerName}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                                            onClick={() =>
                                                this.props.history.push('/AddCode')
                                            }
                                        >
                                            <div className="BWPQWAD-f-m">
                                                <i className="fa fa-plus BWPQWAD-l-cb" />
                                                <span className="BWPQWAD-k-u">
                                                    Dodaj kod
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    {/* <div>
                                        <button
                                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                                            onClick={() =>
                                                this.props.history.push(
                                                    '/ChargeWallet'
                                                )
                                            }
                                        >
                                            <div className="BWPQWAD-f-m">
                                                <i className="fa fa-usd BWPQWAD-l-cb" />
                                                <span className="BWPQWAD-k-u">
                                                    Stan konta:{' '}
                                                    {Config.network.balance}zł
                                                </span>
                                            </div>
                                        </button>
                                    </div> */}
                                </div>
                            </header>
                        </div>
                        <div>
                            <div className="BWPQWAD-n-a">
                                <sidebar className="BWPQWAD-p-c BWPQWAD-B-c">
                                    <nav>
                                        <ol>
                                            <li>
                                                <NavLink to={`/AccountNetwork`}>
                                                    <span>Współdzielenie</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to={`/NetworkServices`}
                                                >
                                                    <span>Usługi</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to={`/NetworkSettings`}
                                                >
                                                    <span>Ustawienia API</span>
                                                </NavLink>
                                            </li>
                                            <li className="BWPQWAD-n-f">
                                                <NavLink
                                                    to={`/NetworkCodes`}
                                                    onClick={e =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <span>Kody SMS</span>
                                                </NavLink>
                                            </li>
                                        </ol>
                                    </nav>
                                </sidebar>
                                <aside />
                                <div>
                                    <div className="BWPQWAD-Eh-a">
                                        <div className="BWPQWAD-Gl-b">
                                            <section>
                                                {table}
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

        return content;
    }

    render() {
        return <this.MapMenu />;
    }
}

export default NetworkCodes;
