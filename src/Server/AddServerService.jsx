import React, { Component } from 'react';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';

import { serverStore, serviceStore, LogToDatabase } from '../App';

class AddServerService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSet: false,
            service_id: null,
            prices: [{ id: 0, amount: 1, price: 1 }],
            last_price: 0,
            service_api: null,
            service_weapon: 1
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.SendAdd = this.SendAdd.bind(this);
        this.ServiceChange = this.ServiceChange.bind(this);
        this.FlagsChange = this.FlagsChange.bind(this);
        this.WeaponChange = this.WeaponChange.bind(this);
        this.AmountChange = this.AmountChange.bind(this);
        this.SkinNameChange = this.SkinNameChange.bind(this);
        this.PriceChange = this.PriceChange.bind(this);
        this.AddPrice = this.AddPrice.bind(this);
        this.RemovePrice = this.RemovePrice.bind(this);
        this.APIChange = this.APIChange.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(function (data) {
                serviceStore.getNetworkServices(data => {
                    th.setState(
                        {
                            services: data,
                            service_type: data[0].service_type
                        },
                        () => {
                            axios
                                .post(
                                    Config.urls.getNetworkApis,
                                    qs.stringify({
                                        net_id: Config.network.net_id
                                    })
                                )
                                .then(response => {
                                    th.setState({
                                        apis: response.data,
                                        service_api:
                                            response.data[0].accounts[0].id
                                    });
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    );
                });
            });
        } else {
            serviceStore.getNetworkServices(data => {
                th.setState(
                    {
                        services: data,
                        service_type: data[0].service_type
                    },
                    () => {
                        axios
                            .post(
                                Config.urls.getNetworkApis,
                                qs.stringify({
                                    net_id: Config.network.net_id
                                })
                            )
                            .then(response => {
                                th.setState({
                                    apis: response.data,
                                    service_api: response.data[0].accounts[0].id
                                });
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                );
            });
        }
    }

    ServiceChange(e) {
        const services = this.state.services;
        for (let i in services) {
            if (services[i].service_id === e.target.value) {
                this.setState({ service_type: services[i].service_type });
                break;
            }
        }
        this.setState({
            service_id: e.target.value,
            inputSet: true
        });
    }

    FlagsChange(e) {
        let flags = e.target.value.toLowerCase().trim();
        let exp = RegExp(/^([a-z])+$/g);
        if (exp.test(flags)) {
            this.setState({
                service_flags: flags,
                errorFlags: null,
                inputSet: true
            });
        } else {
            this.setState({
                errorFlags: 'Niepoprawna wartość (a-z)'
            });
        }
    }

    WeaponChange(e) {
        let weapon_id = e.target.value.trim();
        let exp = RegExp(/^(\d)+$/g);
        if (exp.test(weapon_id)) {
            this.setState({
                service_weapon: weapon_id,
                errorSkins: null,
                inputSet: true
            });
        } else {
            this.setState({
                errorSkins: 'Niepoprawna wartość (0-9)'
            });
        }
    }

    AmountChange(e) {
        let nodes = document.getElementsByClassName('gwt-Amount');
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
            prices[i].amount = nodes[prices[i].id].value.trim();
        }
        this.setState({
            prices: prices,
            inputSet: true
        });
    }

    SkinNameChange(e) {
        let nodes = document.getElementsByClassName('gwt-SkinName');
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
            prices[i].name = nodes[prices[i].id].value.trim();
        }
        this.setState({
            prices: prices,
            inputSet: true
        });
    }

    PriceChange(e) {
        let nodes = document.getElementsByClassName('gwt-Price');
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
            prices[i].price = nodes[prices[i].id].value;
        }
        this.setState({
            prices: prices,
            inputSet: true
        });
    }

    AddPrice() {
        let prices = this.state.prices;
        let last = this.state.last_price;
        last++;
        prices.push({ id: last, amount: 1, price: 1 });
        this.setState({ prices: prices, last_price: last, inputSet: true });
    }

    RemovePrice() {
        let prices = this.state.prices;
        let last = this.state.last_price;
        last--;
        prices = prices.slice(0, -1);
        this.setState({ prices: prices, last_price: last, inputSet: true });
    }

    APIChange(e) {
        let api = e.target.value;

        this.setState({
            service_api: api,
            inputSet: true
        });
    }

    SendAdd() {
        const th = this;
        const prices = this.state.prices;
        const service_type = this.state.service_type;
        const api = this.state.service_api;
        let flags = null,
            weapon_id = null;
        if (service_type === '0') {
            flags = this.state.service_flags.toLowerCase();
        } else if (service_type === '2') {
            weapon_id = this.state.service_weapon;
        }
        let error = false;

        if (!prices || prices.length < 1) {
            error = true;
        }

        if (service_type === '0' && (!flags || flags.length < 1)) {
            error = true;
        } else if (
            service_type === '2' &&
            (!weapon_id || weapon_id.length < 1)
        ) {
            error = true;
        }

        if (error) {
            this.setState({
                errorPrice: 'Podaj przynajmniej jedną cenę',
                errorFlags: 'Podaj przynajmniej jedną flagę',
                errorSkins: 'Podaj numer broni'
            });
        } else {
            let exp = RegExp(/^([a-z])+$/g);
            if (exp.test(flags)) {
                this.setState({ errorFlags: null, errorPrice: null });
            } else {
                error = true;
                this.setState({
                    errorFlags: 'Niepoprawna wartość (a-z)'
                });
            }
        }

        if (!error) {
            let service_id = null;
            if (this.state.service_id == null)
                service_id = document.getElementById('service_id').value;
            else service_id = this.state.service_id;
            let server = this.props.match.params.server;
            axios
                .post(
                    Config.urls.addServerService,
                    qs.stringify({
                        server_id: server,
                        service_id: service_id,
                        prices: JSON.stringify(prices),
                        flags: flags,
                        weapon_id: weapon_id,
                        service_api: api
                    })
                )
                .then(response => {
                    console.log(response.data);
                    LogToDatabase(
                        'Add server service ' + server + ' ' + service_id
                    );
                    th.props.history.push('/ServerServices/' + server);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    RenderContent(props) {
        let save_button;
        const services_array = this.state.services;
        const service_type = this.state.service_type;
        let services = [],
            servicesList;
        for (let i in services_array) {
            services.push(services_array[i]);
        }

        if (services.length > 0) {
            servicesList = services.map(service => (
                <option value={service.service_id} key={service.service_id}>
                    {service.service_id} | {service.service_title} |{' '}
                    {service.service_description}
                </option>
            ));
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
                    onClick={this.SendAdd}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        let errorFlags;
        if (this.state.errorFlags) {
            errorFlags = (
                <div className="alert alert-danger">
                    {this.state.errorFlags}
                </div>
            );
        }

        let flags;
        if (service_type === '0') {
            flags = (
                <label>
                    <div>
                        <p className="BWPQWAD-j-i"> Flagi </p>
                    </div>
                    <div>
                        <div>
                            <div className="BWPQWAD-Am-a">
                                <input
                                    className="gwt-TextBox BWPQWAD-Am-d"
                                    dir="ltr"
                                    type="text"
                                    onChange={this.FlagsChange}
                                    placeholder="abcdefghijklmnopqrstuz"
                                />
                                {errorFlags}
                            </div>
                        </div>
                        <p className="BWPQWAD-j-h">
                            Flagi które zostaną przypisane graczowi.
                        </p>
                    </div>
                </label>
            );
        }

        let errorSkins;
        if (this.state.errorSkins) {
            errorSkins = (
                <div className="alert alert-danger">
                    {this.state.errorSkins}
                </div>
            );
        }

        let skins;
        if (service_type === '2') {
            skins = (
                <label>
                    <div>
                        <p className="BWPQWAD-j-i"> Broń </p>
                    </div>
                    <div>
                        <div>
                            <div className="BWPQWAD-Am-a">
                                <input
                                    className="gwt-TextBox BWPQWAD-Am-d"
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    onChange={this.WeaponChange}
                                />
                                {errorSkins}
                            </div>
                        </div>
                        <p className="BWPQWAD-j-h">
                            Numer broni do której przypisany zostanie skin
                            (wartość weapon_id w pluginie usługi).
                        </p>
                    </div>
                </label>
            );
        }

        let errorPrice;
        if (this.state.errorPrice) {
            errorPrice = (
                <div className="alert alert-danger">
                    {this.state.errorPrice}
                </div>
            );
        }

        let priceList,
            prices = this.state.prices;
        const priceTable = Config.prices.map(price => (
            <option value={price.id} key={price.id}>
                {price.value}
            </option>
        ));
        if (prices && prices.length > 0) {
            if (service_type === '2') {
                priceList = prices.map(price => (
                    <div
                        className="BWPQWAD-Am-a"
                        key={price.id}
                        style={{ marginBottom: '15px' }}
                    >
                        <span
                            style={{
                                minWidth: '80px',
                                display: 'inline-block'
                            }}
                        >
                            ID Skina:
                        </span>
                        <input
                            className="gwt-TextBox gwt-Amount BWPQWAD-In-a"
                            min="1"
                            defaultValue="1"
                            type="number"
                            onChange={this.AmountChange}
                        />
                        <br />
                        <span
                            style={{
                                minWidth: '80px',
                                display: 'inline-block'
                            }}
                        >
                            Nazwa Skina:
                        </span>
                        <input
                            className="gwt-TextBox gwt-SkinName BWPQWAD-In-a"
                            type="text"
                            onChange={this.SkinNameChange}
                        />
                        <br />
                        <span
                            style={{
                                minWidth: '80px',
                                display: 'inline-block'
                            }}
                        >
                            Cena:
                        </span>
                        <select
                            className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                            onChange={this.PriceChange}
                        >
                            {priceTable}
                        </select>
                    </div>
                ));
            } else if (service_type === '1') {
                priceList = prices.map(price => (
                    <div className="BWPQWAD-Am-a" key={price.id}>
                        Ilość:&nbsp;
                        <input
                            className="gwt-TextBox gwt-Amount BWPQWAD-In-a"
                            min="1"
                            defaultValue="1"
                            type="number"
                            onChange={this.AmountChange}
                        />
                        Cena: <select
                            className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                            onChange={this.PriceChange}
                        >
                            {priceTable}
                        </select>
                    </div>
                ));
            } else {
                priceList = prices.map(price => (
                    <div className="BWPQWAD-Am-a" key={price.id}>
                        Dni:&nbsp;
                        <input
                            className="gwt-TextBox gwt-Amount BWPQWAD-In-a"
                            min="1"
                            defaultValue="1"
                            type="number"
                            onChange={this.AmountChange}
                        />
                        Cena: <select
                            className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                            onChange={this.PriceChange}
                        >
                            {priceTable}
                        </select>
                    </div>
                ));
            }
        }

        let apis = this.state.apis || null,
            apisList = [],
            apis_list;
        if (apis && apis.length > 0) {
            for (let i in apis) {
                apisList.push(apis[i]);
            }
            apis_list = apisList.map(api =>
                api.accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                        {api.name} | {acc.title} | {acc.api_key}
                    </option>
                ))
            );
        }

        let api;
        api = (
            <label>
                <div>
                    <p className="BWPQWAD-j-i"> API </p>
                </div>
                <div>
                    <div>
                        <div className="BWPQWAD-Am-a">
                            <select
                                className="gwt-TextBox BWPQWAD-In-a"
                                onChange={this.APIChange}
                            >
                                {apis_list}
                            </select>
                        </div>
                    </div>
                    <p className="BWPQWAD-j-h">API do wysyłki SMS.</p>
                </div>
            </label>
        );

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Dodawanie Usługi
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Usługa </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <select
                                                id="service_id"
                                                className="form-control"
                                                onChange={this.ServiceChange}
                                            >
                                                {servicesList}
                                            </select>
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Usługa, która ma być przypisana do
                                        serwera.
                                    </p>
                                </div>
                            </label>
                            {flags}
                            {skins}
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Cennik </p>
                                </div>
                                <div>
                                    <div>
                                        {priceList}
                                        <i
                                            className="fa fa-plus-circle BWPQWAD-In-b"
                                            title="Nowa cena"
                                            onClick={this.AddPrice}
                                        />
                                        <i
                                            className="fa fa-minus-circle BWPQWAD-In-b"
                                            title="Usuń ostatnią cene"
                                            onClick={this.RemovePrice}
                                        />
                                    </div>
                                    {service_type === '2' ? (
                                        <p className="BWPQWAD-j-h">
                                            Numer (id) skina który zostanie
                                            dodany (wartość skin_id w pluginie
                                            usługi).
                                        </p>
                                    ) : (
                                            ''
                                        )}
                                    {errorPrice}
                                </div>
                            </label>
                            {api}
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

export default AddServerService;
