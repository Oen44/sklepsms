import React, { Component } from 'react';
import { serverStore, serviceStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';

class EditServerService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSet: false,
            services: [],
            service_id: null,
            service_api: null,
            prices: [],
            last_price: null,
            apis: [],
            service_weapon: 1
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.ServiceChange = this.ServiceChange.bind(this);
        this.FlagsChange = this.FlagsChange.bind(this);
        this.WeaponChange = this.WeaponChange.bind(this);
        this.AmountChange = this.AmountChange.bind(this);
        this.SkinNameChange = this.SkinNameChange.bind(this);
        this.PriceChange = this.PriceChange.bind(this);
        this.AddPrice = this.AddPrice.bind(this);
        this.RemovePrice = this.RemovePrice.bind(this);
        this.APIChange = this.APIChange.bind(this);
        this.SendEdit = this.SendEdit.bind(this);
        this.LoadService = this.LoadService.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(function (data) {
                serviceStore.getNetworkServices(data => {
                    th.setState(
                        {
                            services: data
                        },
                        th.LoadService()
                    );
                });
            });
        } else {
            serviceStore.getNetworkServices(data => {
                th.setState(
                    {
                        services: data
                    },
                    th.LoadService()
                );
            });
        }
    }

    LoadService() {
        let th = this;
        axios
            .post(
                Config.urls.getService,
                qs.stringify({
                    id: th.props.match.params.id
                })
            )
            .then(response => {
                th.setState(
                    {
                        prices: response.data.prices,
                        service: response.data,
                        service_flags: response.data.flags,
                        service_api: response.data.api
                    },
                    () => {
                        let type = null;
                        const services = th.state.services;
                        const service = th.state.service;
                        for (let i in services) {
                            if (services[i].service_id === service.service_id) {
                                type = services[i].service_type;
                                break;
                            }
                        }
                        if (type === null) {
                            th.setState({
                                ownerError: 'Ta usługa nie należy do Ciebie!'
                            });
                            return;
                        }
                        th.setState({ service_type: type }, () => {
                            axios
                                .post(
                                    Config.urls.getNetworkApis,
                                    qs.stringify({
                                        net_id: Config.network.net_id
                                    })
                                )
                                .then(response => {
                                    th.setState({
                                        apis: response.data
                                    });
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        });
                    }
                );
            })
            .catch(error => {
                console.log(error);
            });
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
            inputSet: true,
            service_id: e.target.value
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
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
            let node = document.getElementById('amount-' + prices[i].id);
            prices[i].amount = node.value.trim();
        }
        this.setState({
            prices: prices,
            inputSet: true
        });
    }

    PriceChange(e) {
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
            let node = document.getElementById('price-' + prices[i].id);
            prices[i].price = node.value;
        }
        this.setState({
            prices: prices,
            inputSet: true
        });
    }

    SkinNameChange(e) {
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
            let node = document.getElementById('name-' + prices[i].id);
            prices[i].name = node.value.trim();
        }
        this.setState({
            prices: prices,
            inputSet: true
        });
    }

    AddPrice() {
        let prices = this.state.prices;
        if (!prices) {
            prices = [];
        }
        let last = this.state.last_price;
        if (last == null) {
            last = this.state.service.prices.length || -1;
        }
        last++;
        prices.push({ id: last, amount: 1, price: 1 });
        this.setState({ prices: prices, last_price: last, inputSet: true });
    }

    RemovePrice() {
        let prices = this.state.prices;
        if (!prices) {
            return;
        }
        let last = this.state.last_price;
        if (last == null) {
            last = this.state.service.prices.length || 0;
        }
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

    SendEdit() {
        const th = this;
        const id = this.props.match.params.id;
        const service_type = this.state.service_type;
        const api = this.state.service_api;
        let flags = null,
            weapon_id = null;
        if (service_type === '0') {
            flags = this.state.service_flags.toLowerCase();
        } else if (service_type === '2') {
            weapon_id = this.state.service_weapon;
        }
        let prices = this.state.prices;
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
                errorSkins: 'Podaj number broni'
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
            prices = JSON.stringify(prices);
            axios
                .post(
                    Config.urls.editServerService,
                    qs.stringify({
                        id: id,
                        service_id: service_id,
                        prices: prices,
                        flags: flags,
                        weapon_id: weapon_id,
                        service_api: api
                    })
                )
                .then(response => {
                    LogToDatabase('Edit server service ' + service_id);
                    th.props.history.push(
                        '/ServerServices/' + th.state.service.server_id
                    );
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    RenderContent(props) {
        const service = this.state.service;

        if (!service) {
            return (
                <div className="BFPMQ6-Z-a" data-hidden="false">
                    <div className="BFPMQ6-k-Q BFPMQ6-k-t">
                        <span className="BFPMQ6-l-K BFPMQ6-Z-b" />
                    </div>
                </div>
            );
        }
        let ownerError = this.state.ownerError;
        if (ownerError) {
            return (
                <div className="BFPMQ6-Z-a" data-hidden="false">
                    <div className="alert alert-danger">{ownerError}</div>
                </div>
            );
        }
        const service_type = this.state.service_type;

        let save_button, servicesList;
        const services = this.state.services;
        if (services.length > 0) {
            servicesList = services.map(s => (
                <option value={s.service_id} key={s.service_id}>
                    {s.service_id} | {s.service_title} | {s.service_description}
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
                    onClick={this.SendEdit}
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
                                    defaultValue={service.flags}
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
                                    defaultValue={service.weapon_id}
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
                            type="number"
                            defaultValue={price.amount}
                            id={'amount-' + price.id}
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
                            defaultValue={price.name}
                            id={'name-' + price.id}
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
                            defaultValue={price.price}
                            id={'price-' + price.id}
                        >
                            <option value="1">1.23</option>
                            <option value="2">2.46</option>
                            <option value="3">3.69</option>
                            <option value="4">4.92</option>
                            <option value="5">6.15</option>
                            <option value="6">7.38</option>
                            <option value="7">11.07</option>
                            <option value="8">17.22</option>
                            <option value="9">23.37</option>
                            <option value="10">30.75</option>
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
                            type="number"
                            defaultValue={price.amount}
                            id={'amount-' + price.id}
                            onChange={this.AmountChange}
                        />
                        Cena:{' '}
                        <select
                            className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                            onChange={this.PriceChange}
                            defaultValue={price.price}
                            id={'price-' + price.id}
                        >
                            <option value="1">1.23</option>
                            <option value="2">2.46</option>
                            <option value="3">3.69</option>
                            <option value="4">4.92</option>
                            <option value="5">6.15</option>
                            <option value="6">7.38</option>
                            <option value="7">11.07</option>
                            <option value="8">17.22</option>
                            <option value="9">23.37</option>
                            <option value="10">30.75</option>
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
                            type="number"
                            defaultValue={price.amount}
                            id={'amount-' + price.id}
                            onChange={this.AmountChange}
                        />
                        Cena:{' '}
                        <select
                            className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                            onChange={this.PriceChange}
                            defaultValue={price.price}
                            id={'price-' + price.id}
                        >
                            <option value="1">1.23</option>
                            <option value="2">2.46</option>
                            <option value="3">3.69</option>
                            <option value="4">4.92</option>
                            <option value="5">6.15</option>
                            <option value="6">7.38</option>
                            <option value="7">11.07</option>
                            <option value="8">17.22</option>
                            <option value="9">23.37</option>
                            <option value="10">30.75</option>
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
            apis_list = (
                <select
                    className="gwt-TextBox BWPQWAD-In-a"
                    onChange={this.APIChange}
                    defaultValue={service.api}
                >
                    {apisList.map(api =>
                        api.accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {api.name} | {acc.title} | {acc.api_key}
                            </option>
                        ))
                    )}
                </select>
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
                        <div className="BWPQWAD-Am-a">{apis_list}</div>
                    </div>
                    <p className="BWPQWAD-j-h">API do wysyłki SMS.</p>
                </div>
            </label>
        );

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Edycja Usługi
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
                                                className="form-control"
                                                onChange={this.ServiceChange}
                                                defaultValue={
                                                    service.service_id
                                                }
                                                id="service_id"
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

export default EditServerService;
