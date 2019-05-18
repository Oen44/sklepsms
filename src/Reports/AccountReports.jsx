import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { reportStore, serverStore } from '../App';

class AccountReports extends Component {
    constructor(props) {
        super(props);
        this.state = { reports: [], reportInfo: [] };
        this.MapReports = this.MapReports.bind(this);
        this.FilterList = this.FilterList.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
        if (reportStore.getState().length <= 0) {
            reportStore.getAccountReports(function (data) {
                let reportInfo = [];
                for (let i in data) {
                    reportInfo.push(data[i]);
                }
                th.setState({
                    reports: data,
                    reportInfo: reportInfo
                });
            });
        }
    }

    componentDidMount() {
        let th = this;

        let reportInfo = [];
        let data = reportStore.getState();
        for (let i in data) {
            reportInfo.push(data[i]);
        }
        th.setState({
            reports: data,
            reportInfo: reportInfo
        });
    }

    FilterList(e) {
        let reportInfo = [];
        let reports = this.state.reports;

        for (let i in reports) {
            if (
                reports[i].title
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
                reportInfo.push(reports[i]);
        }
        this.setState({
            reportInfo: reportInfo
        });
    }

    MapReports(props) {
        let reportInfo = this.state.reportInfo;

        const list = reportInfo.map(report => (
            <tr className="BWPQWAD-Xc-b BFPMQ6-T-r" key={report.id}>
                <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c BWPQWAD-Xc-d">
                    <div>
                        <NavLink
                            to={`/ReportView/${report.id}`}
                            data-column="TITLE"
                        >
                            <span>{report.id}</span>
                        </NavLink>
                    </div>
                </td>
                <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                    <div>
                        <NavLink to={`/ReportView/${report.id}`}>
                            <span>{report.title}</span>
                        </NavLink>
                    </div>
                </td>
                <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                    <div>
                        <NavLink to={`/ReportView/${report.id}`}>
                            <span>{report.date}</span>
                        </NavLink>
                    </div>
                </td>
                <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                    <div>
                        <NavLink to={`/ReportView/${report.id}`}>
                            <span>{report.status.toUpperCase()}</span>
                        </NavLink>
                    </div>
                </td>
                <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c">
                    <div>
                        <NavLink to={`/ReportView/${report.id}`}>
                            <span>{report.count}</span>
                        </NavLink>
                    </div>
                </td>
            </tr>
        ));

        let add_button = (
            <button
                className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                onClick={() => this.props.history.push('/AddReport')}
            >
                <div className="BWPQWAD-f-m">
                    <i className="fa fa-plus BWPQWAD-l-cb" />
                    <span className="BWPQWAD-k-u"> Dodaj raport </span>
                </div>
            </button>
        );

        return (
            <div>
                <div className="BWPQWAD-N-a">
                    <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                        <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                            <span style={{ verticalAlign: 'middle' }}>
                                Twoje raporty
                            </span>
                            <input
                                type="text"
                                className="gwt-TextBox BWPQWAD-Am-d"
                                style={{
                                    marginLeft: 15 + 'px',
                                    fontSize: 15 + 'px'
                                }}
                                placeholder="Szukaj raportu..."
                                onChange={this.FilterList}
                            />
                        </h2>
                        <div>{add_button}</div>
                    </header>
                    <div className="BWPQWAD-k-K">
                        <table className="BWPQWAD-t-T">
                            <thead>
                                <tr>
                                    <th className="BWPQWAD-Xc-h">
                                        Numer Raportu
                                    </th>
                                    <th className="BWPQWAD-Xc-h"> Temat </th>
                                    <th className="BWPQWAD-Xc-h"> Data </th>
                                    <th className="BWPQWAD-Xc-h"> Status </th>
                                    <th className="BWPQWAD-Xc-h">Odpowiedzi</th>
                                </tr>
                            </thead>
                            <colgroup>
                                <col style={{ width: 10 + '%' }} />
                                <col style={{ width: 13 + '%' }} />
                                <col style={{ width: 15 + '%' }} />
                                <col style={{ width: 12 + '%' }} />
                                <col style={{ width: 10 + '%' }} />
                            </colgroup>
                            <tbody>{list}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return <this.MapReports />;
    }
}

export default AccountReports;
