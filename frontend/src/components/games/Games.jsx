import React, {Component} from 'react';
import axios from 'axios';
import Main from '../templates/Main';

const headerProps = {
    icon: 'gamepad',
    title: 'Games',
}

const baseUrl = 'http://localhost:3001/games'

const initialState = {
    game: {name: '', category: '', release: ''},
    list: [],
    loading: false,
    error: null,
}


export default class Games extends Component {

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
        this.setState({game: initialState.game})
    }

    save() {
        const game = this.state.game
        const method = game.id ? 'put' : 'post'
        const url = game.id ? `${baseUrl}/${game.id}` : baseUrl
        this.setState({loading: true})
        axios[method](url, game)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({game: initialState.game, list, loading: false})
            })
            .catch(error => {
                this.setState({error: error.message, loading: false})
            })
    }

    getUpdatedList(game, add = true) {
        const list = this.state.list.filter(u => u.id !== game.id)
        if(add) list.unshift(game)
        return list
    }

    updateField(event) {
        const game = {...this.state.game}
        game[event.target.name] = event.target.value
        this.setState({game})
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
                                value={this.state.game.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Enter name..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Category</label>
                            <input type="text" className='form-control'
                                name='category'
                                value={this.state.game.category}
                                onChange={e => this.updateField(e)}
                                placeholder="Enter category..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Release</label>
                            <input type="text" className='form-control'
                                name='release'
                                value={this.state.game.release}
                                onChange={e => this.updateField(e)}
                                placeholder="Enter year..." />
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
      

    load(game) {
        this.setState({game})
    }

    remove(game) {
        axios.delete(`${baseUrl}/${game.id}`).then(resp => {
            const list = this.getUpdatedList(game, false)
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
                            <th>Category</th>
                            <th>Release</th>
                            <th>Actions</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th>
                                <input type="text" className="form-control" placeholder="Search by name, category or release"
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
        const filteredList = list.filter(game => {
          return (
            game.name.toLowerCase().includes(search.toLowerCase()) ||
            game.category.toLowerCase().includes(search.toLowerCase()) ||
            game.release.toString().toLowerCase().includes(search.toLowerCase())
          )
        })
      
        return filteredList.map(game => {
            return (
                <tr key={game.id}>
                    <td>{game.id}</td>
                    <td>{game.name}</td>
                    <td>{game.category}</td>
                    <td>{game.release}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(game)}>
                            <i className='fa fa-pencil'></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(game)}>
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