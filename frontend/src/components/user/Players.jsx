import React, {Component} from 'react';
import axios from 'axios';
import Main from '../templates/Main';

const headerProps = {
    icon: 'users',
    title: 'Players',
}

const baseUrl = 'http://localhost:3001/users'

const initialState = {
    user: {name: '', email: '', address: ''},
    list: [],
    loading: false,
    error: null,
}

export default class Players extends Component {

    state = {...initialState, search:''}

    componentDidMount() {
        this.fetchGames()
    }

    fetchGames = () => {
        this.setState({loading: true})
        axios(baseUrl)
            .then(resp => {
                this.setState({list: resp.data, loading: false})
            })
            .catch(error => {
                this.setState({error: error.message, loading: false})
            })
    }

    clear() {
        this.setState({user: initialState.user})
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        this.setState({loading: true})
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({user: initialState.user, list, loading: false})
            })
            .catch(error => {
                this.setState({error: error.message, loading: false})
            }) 
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className='form-control'
                                name='name'
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Enter name..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className='form-control'
                                name='email'
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Enter e-mail..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" className='form-control'
                                name='address'
                                value={this.state.user.address}
                                onChange={e => this.updateField(e)}
                                placeholder="Enter location..." />
                        </div>
                    </div>
                </div>

                <hr />
                <div className='row'>
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Save
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    updateSearch(event) {
        this.setState({ search: event.target.value })
    }

    load(user) {
        this.setState({user})
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
        })
    }

    renderTable() {
        const { search } = this.state

        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>E-mail</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>
                            <input type="text" className="form-control" placeholder="Search by name, email or address"
                                value={search} onChange={(e) => this.updateSearch(e)} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        const { list, search } = this.state
        const filteredList = list.filter(user => {
          return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.address.toString().toLowerCase().includes(search.toLowerCase())
          )
        })

        return filteredList.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className='fa fa-pencil'></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}