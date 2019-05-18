import React, { Component } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { NavLink } from 'react-router-dom';
import { serverStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';

import axios from 'axios';
import qs from 'qs';

let data = {
    labels: [
        'Styczeń',
        'Luty',
        'Marzec',
        'Kwiecień',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpień',
        'Wrzesień',
        'Październik',
        'Listopad',
        'Grudzień'
    ],
    datasets: [
        {
            label: 'Miesięczny Przychód',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(51,153,255, 0.6)',
            borderColor: '#3366CC',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#3366CC',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#3399FF',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [],
            spanGaps: false
        }
    ]
};
let options = {
    responsive: false,
    legend: {
        display: false
    },
    title: {
        display: true,
        text: 'Miesięczny Przychód',
        fontColor: Config.style === 1 ? '#fff' : '#666'
    },
    scales: {
        xAxes: [
            {
                ticks: {
                    autoSkip: false,
                    fontColor: Config.style === 1 ? '#fff' : '#666'
                }
            }
        ],
        yAxes: [
            {
                ticks: {
                    fontColor: Config.style === 1 ? '#fff' : '#666'
                }
            }
        ]
    }
};
let optionsPie = {
    responsive: false,
    legend: {
        display: true,
        labels: {
            fontColor: Config.style === 1 ? '#fff' : '#666'
        }
    },
    title: {
        display: true,
        text: 'Zakupione Usługi',
        fontColor: Config.style === 1 ? '#fff' : '#666'
    }
};
let dataPie = {
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }
    ]
};

class ServerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charts: false
        };
        this.MapMenuDashboard = this.MapMenuDashboard.bind(this);
        this.DeleteServer = this.DeleteServer.bind(this);
        this.LoadData = this.LoadData.bind(this);
        this.LoadData();
    }

    componentWillMount() {
        const th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                th.setState(prev => {
                    return (th.state = prev);
                }, th.LoadData());
            });
        }
    }

    LoadData(reload) {
        const th = this;
        const id = this.props.match.params.id;
        axios
            .post(
                Config.urls.getServerStats,
                qs.stringify({
                    id: id
                })
            )
            .then(response => {
                let monthly = response.data[0];
                let solds = response.data[1];
                if (monthly) {
                    for (let i = 1; i <= 12; i++) {
                        let income = monthly[i] ? monthly[i].income : 0;
                        data.datasets[0].data[i - 1] = income;
                    }
                }

                if (solds) {
                    for (let i = 0; i < solds.length; i++) {
                        dataPie.labels[i] = solds[i].service;
                        dataPie.datasets[0].data[i] = solds[i].solds;
                        dataPie.datasets[0].backgroundColor[i] =
                            Config.colors[i];
                        dataPie.datasets[0].hoverBackgroundColor[i] =
                            Config.colors[i];
                    }
                } else {
                    dataPie.labels = [];
                    dataPie.datasets[0].data = [];
                }
                th.setState({
                    charts: true
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    DeleteServer() {
        let id = this.props.match.params.id;
        let server = serverStore.getState()[id];
        axios
            .post(
                Config.urls.deleteServer,
                qs.stringify({
                    id: id
                })
            )
            .then(response => {
                LogToDatabase(
                    'Delete server ' +
                    id +
                    ' ' +
                    server.web_page +
                    ' ' +
                    server.name +
                    ' ' +
                    server.ip_address
                );
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    MapMenuDashboard(props) {
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

        let charts;
        if (this.state.charts) {
            charts = (
                <div className="BWPQWAD-Gl-c">
                    <div className="BWPQWAD-Ym-a BWPQWAD-k-K">
                        <Line
                            data={data}
                            options={options}
                            width={document.documentElement.clientWidth - 500}
                            height={420}
                        />
                    </div>
                    <div className="BWPQWAD-Ym-ab BWPQWAD-k-K">
                        <Pie
                            data={dataPie}
                            options={optionsPie}
                            width={480}
                            height={300}
                        />
                    </div>
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
                                        <li className="BWPQWAD-n-f">
                                            <NavLink
                                                to={`/ServerDashboard/${serverID}`}
                                                onClick={e =>
                                                    e.preventDefault()
                                                }
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
                                        <section>{charts}</section>
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
            <this.MapMenuDashboard
                serverId={this.props.match.params.id}
                info={serverStore.getState()}
            />
        );
    }
}

export default ServerDashboard;
