import React, { Component } from 'react';
import Theme from './theme';
import axios from 'axios';
import allPlayers from '../allplayers.json';
import { Link } from 'react-router-dom';
import blankplayer from '../blankplayer.jpeg';

class Roster extends Component {
	constructor(props) {
		super(props);
		this.state = {
			league_id: this.props.match.params.league_id,
			league_name: '',
			username: this.props.match.params.username,
			user_id: '',
			avatar: '',
			league_avatar: '',
			players: [],
			playerValues: [],
			value: ''
		}
	}



	componentDidMount() {
		fetch('/dynastyvalues')
		.then(res => res.json()).then(data => {
			let players = data.name
			for (let i = 0; i < players.length; i++) {
				let playerx = this.state.playerValues.concat({
					name: players[i].name,
					searchName: players[i].searchName,
					team: players[i].team,
					value: players[i].value,
					position: players[i].position
				})
				this.setState({
					playerValues: playerx
				})
			}
		})
		

		axios.get(`https://api.sleeper.app/v1/user/${this.state.username}`)
		.then(res => {
			this.setState({
				user_id: res.data.user_id,
				avatar: res.data.avatar === null ? blankplayer : `https://sleepercdn.com/avatars/thumbs/${res.data.avatar}`
			})
		})
		axios.get(`https://api.sleeper.app/v1/league/${this.state.league_id}`)
		.then(res => {
			this.setState({
				league_name: res.data.name,
				league_avatar: res.data.avatar === null ? blankplayer : `https://sleepercdn.com/avatars/thumbs/${res.data.avatar}`
			})
		})
		axios.get(`https://api.sleeper.app/v1/league/${this.state.league_id}/rosters`)
		.then(res => {
			let rosters = res.data === null ? [] : res.data;
			for (let i = 0; i < rosters.length; i++) {
				if (rosters[i].owner_id === this.state.user_id && rosters[i].players !== null) {
					for (let j = 0; j < rosters[i].players.length; j++) {
						let players = this.state.players.concat(rosters[i].players[j]);
						this.setState({
							players: players
						})
					}	
				}
			}
		})
		

	}

	render() {
		for (let i = 0; i < this.state.players.length; i++) {
			let p = this.state.playerValues.find(x => x.searchName === allPlayers[this.state.players[i]].search_full_name)
			allPlayers[this.state.players[i]].value = p === undefined ? '0' : p.value
		}
		let value = this.state.players.reduce((accumulator, current) => accumulator + Number(allPlayers[current].value), 0)
		let players = this.state.players.sort((a, b) => (allPlayers[a].position > allPlayers[b].position) ? 1 : (Number(allPlayers[a].value) < Number(allPlayers[b].value)) ? 1 : -1)
		return <div>
			<Link to="/" className="link">Home</Link>
			<Theme/>
			<h1><img src={this.state.avatar}/>{this.state.username}</h1>
			<h2>{this.state.league_name}<img src={this.state.league_avatar}/></h2>
			<h2>{value}</h2>
			<table>
				<thead>
					<tr>
						<th>Position</th>
						<th>Number</th>
						<th>Name</th>
						<th>Team</th>
						<th>College</th>
						<th>Age</th>
						<th>Years Exp</th>
						<th>Dynasty Value</th>
					</tr>
				</thead>
				<tbody>
				{players.map(player => 
					<tr key={player} className="row">
						<td>{allPlayers[player].position}</td>
						<td>{allPlayers[player].number}</td>
						<td>{allPlayers[player].first_name} {allPlayers[player].last_name}</td>
						<td>{allPlayers[player].team === null ? 'FA' : allPlayers[player].team}</td>
						<td>{allPlayers[player].college}</td>
						<td>{allPlayers[player].age}</td>
						<td>{allPlayers[player].years_exp}</td>
						<td>{allPlayers[player].value}</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	}
}

export default Roster;