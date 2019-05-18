import React, { Component } from 'react';
import Config from '../Utils/Config';
import {
    reportStore,
    serverStore,
    AddAnswerDB,
    OpenAnswerDB,
    CloseAnswerDB
} from '../App';
import $ from 'jquery';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            reportInfo: [],
            description: null
        };
        this.MapReports = this.MapReports.bind(this);
        this.AddAnswer = this.AddAnswer.bind(this);
        this.UpdateDesc = this.UpdateDesc.bind(this);
        this.OpenAnswer = this.OpenAnswer.bind(this);
        this.CloseAnswer = this.CloseAnswer.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                if (reportStore.getState().length <= 0) {
                    reportStore.getAccountReports(function (data) {
                        let reports = data;
                        let report = reports[th.props.match.params.id];
                        if (report) {
                            th.setState({
                                title: report.title,
                                date: report.date
                            });
                        }
                    });
                }
            });
        } else {
            if (reportStore.getState().length <= 0) {
                reportStore.getAccountReports(function (data) {
                    let reports = data;
                    let report = reports[th.props.match.params.id];
                    if (report) {
                        th.setState({
                            title: report.title,
                            date: report.date
                        });
                    }
                });
            }
        }
    }

    UpdateDesc(e) {
        this.setState({
            description: e.target.value
        });
    }

    AddAnswer() {
        let data = [];
        let th = this;
        let reportId = this.props.match.params.id;
        let reportInfo = reportStore.getState()[reportId];
        data.user_id = Config.user_id;
        data.rep_id = reportId;
        data.description = this.state.description.trim();
        data.title = reportInfo.title;
        data.date = reportInfo.date;
        data.email = reportInfo.email;
        AddAnswerDB(data, () => {
            reportStore.getAccountReports(function (data) {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        });
        $('textarea').val('');
    }

    OpenAnswer() {
        let rep_id = this.props.match.params.id;
        let th = this;
        OpenAnswerDB(rep_id, () => {
            th.setState(prev => {
                return (th.state = prev);
            });
        });
    }

    CloseAnswer() {
        let rep_id = this.props.match.params.id;
        let th = this;
        CloseAnswerDB(rep_id, () => {
            th.setState(prev => {
                return (th.state = prev);
            });
        });
    }

    MapReports(props) {
        let reportInfo = [];
        let reportId = props.reportId;
        reportInfo.push(props.info[reportId]);

        if (reportInfo[0] === undefined) {
            return (
                <div className="BFPMQ6-Z-a" data-hidden="false">
                    <div className="BFPMQ6-k-Q BFPMQ6-k-t">
                        <span className="BFPMQ6-l-K BFPMQ6-Z-b" />
                    </div>
                </div>
            );
        }

        const report_title = reportInfo.map(report => (
            <h2
                className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g"
                key={report.id}
            >
                {' '}
                {report.title + ' (#' + report.id + ')'}{' '}
            </h2>
        ));

        const report_date = reportInfo.map(report => (
            <span
                className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s"
                key={report.id}
            >
                Utworzony: {report.date}
            </span>
        ));

        const report_status = reportInfo.map(report => {
            if (report.status === 'Otwarty') {
                return (
                    <span key={report.id}>
                        <span className="BWPQWAD-Tg-x">
                            <span style={{ color: '#84a000' }}>
                                {report.status}
                            </span>
                        </span>
                        <button
                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                            style={{ marginLeft: 10 }}
                            onClick={this.CloseAnswer}
                        >
                            <div className="BWPQWAD-f-m">
                                <span className="BWPQWAD-k-u"> Zamknij </span>
                            </div>
                        </button>
                    </span>
                );
            } else {
                return (
                    <span key={report.id}>
                        <span className="BWPQWAD-Tg-x">
                            <span style={{ color: '#a00000' }}>
                                {report.status}
                            </span>
                        </span>
                        <button
                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                            style={{ marginLeft: 10 }}
                            onClick={this.OpenAnswer}
                        >
                            <div className="BWPQWAD-f-m">
                                <span className="BWPQWAD-k-u"> Otwórz </span>
                            </div>
                        </button>
                    </span>
                );
            }
        });

        let answers;
        reportInfo.map(report => {
            answers = report.answers.map(answer => {
                return (
                    < div className="BWPQWAD-A-n" key={answer.id} >
                        <div>
                            <h3 className="BWPQWAD-S-r">
                                Autor: {answer.username}
                            </h3>
                            <h4>Wysłano: {answer.date}</h4>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: answer.content }}></div>
                    </div>
                );
            });
            return 0;
        });

        return (
            <div>
                <div className="BWPQWAD-N-a BWPQWAD-m-i">
                    <div className="BWPQWAD-Tg-g">
                        <header className="BWPQWAD-k-v">
                            <div className="BWPQWAD-m-d BWPQWAD-Tg-k">
                                <div className="BWPQWAD-Tg-i">
                                    {report_title}
                                    <div className="BWPQWAD-Tg-e">
                                        {report_date}
                                    </div>
                                    <div className="BWPQWAD-Tg-y BWPQWAD-k-s">
                                        {report_status}
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>
                    <div
                        className="BWPQWAD-k-K"
                        style={{ backgroundColor: 'white' }}
                    >
                        <div style={{ display: 'grid' }}>
                            <textarea
                                cols="60"
                                rows="10"
                                onChange={this.UpdateDesc}
                            />
                            <button
                                className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                                onClick={this.AddAnswer}
                            >
                                <div className="BWPQWAD-f-m">
                                    <span className="BWPQWAD-k-u">
                                        Dodaj odpowiedź
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div>{answers}</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <this.MapReports
                reportId={this.props.match.params.id}
                info={reportStore.getState()}
            />
        );
    }
}

export default ReportView;
