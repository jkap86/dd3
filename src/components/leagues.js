import React, { Component } from 'react';
import Theme from './theme';
import axios from 'axios';
import blankplayer from '../blankplayer.jpeg';
import './leagues.css';
import { Link } from 'react-router-dom';

class Leagues extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: this.props.match.params.username,
			leagues: [],
			user_id: '',
			roster: '',
			avatar: '',
			winner: []
		}
	}



	componentWillMount() {
		axios.get(`https://api.sleeper.app/v1/user/${this.state.username}`)
		.then(res => {
			const userID = res.data.user_id
			const avatar = res.data.avatar
			this.setState({
				user_id: userID,
				avatar: `https://sleepercdn.com/avatars/thumbs/${avatar}`
			})
			axios.get(`https://api.sleeper.app/v1/user/${this.state.user_id}/leagues/nfl/2021`)
			.then(res => {
				for (let i = 0; i < res.data.length; i++) {
					let leagues = res.data;
					axios.get(`https://api.sleeper.app/v1/league/${leagues[i].league_id}/rosters`)
					.then(res => {
						let roster = res.data.find(x => x.owner_id === this.state.user_id)
						axios.get(`https://api.sleeper.app/v1/league/${leagues[i].previous_league_id}/winners_bracket`)
						.then(res => {
							let winner = res.data === null ? null : res.data.find(x => x.p === 1).w
							let second = res.data === null ? null : res.data.find(x => x.p === 1).l
								let leagues2 = this.state.leagues.concat({
									name: leagues[i].name,
									avatar: leagues[i].avatar,
									roster_id:  roster === undefined ? 0 : roster.roster_id,
									best_ball: leagues[i].settings.best_ball,
									wins: roster === undefined || roster.settings === undefined ? 0 : roster.settings.wins,
									losses: roster === undefined || roster.settings === undefined ? 0 : roster.settings.losses,
									league_id: leagues[i].league_id,
									fpts: roster === undefined || roster.settings === undefined ? 0 : roster.settings.fpts,
									fpts_against: roster === undefined || roster.settings === undefined || roster.settings.fpts_against === undefined ? 0 : roster.settings.fpts_against,
									pwins: roster === undefined || roster.metadata === null || roster.metadata.record === undefined ? 0 : (roster.metadata.record.match(/W/g) || []).length,
									plosses: roster === undefined || roster.metadata === null || roster.metadata.record === undefined ? 0 : (roster.metadata.record.match(/L/g) || []).length,
									winner: winner,
									second: second
								})
								this.setState({
									leagues: leagues2
								})
							})
							
							.then()
								if (leagues[i].previous_league_id === null || leagues[i].previous_league_id.length < 2) {
									let leagues2 = this.state.leagues.concat({
										name: leagues[i].name,
										avatar: leagues[i].avatar,
										roster_id:  roster === undefined ? 0 : roster.roster_id,
										best_ball: leagues[i].settings.best_ball,
										wins: roster === undefined || roster.settings === undefined ? 0 : roster.settings.wins,
										losses: roster === undefined || roster.settings === undefined ? 0 : roster.settings.losses,
										league_id: leagues[i].league_id,
										fpts: roster === undefined || roster.settings === undefined ? 0 : roster.settings.fpts,
										fpts_against: roster === undefined || roster.settings === undefined || roster.settings.fpts_against === undefined ? 0 : roster.settings.fpts_against,
										pwins: roster === undefined || roster.metadata === null || roster.metadata.record === undefined ? 0 : (roster.metadata.record.match(/W/g) || []).length,
										plosses: roster === undefined || roster.metadata === null || roster.metadata.record === undefined ? 0 : (roster.metadata.record.match(/L/g) || []).length,
										winner: null,
										second: null
									})
									this.setState({
										leagues: leagues2
									})
								}
							})
								
														
						
					
					
					
				}
				
			})
		})
		
	}

	render() {
		let record = this.state.leagues.reduce((accumulator, current) => accumulator + current.wins, 0) + " - " + this.state.leagues.reduce((accumulator, current) => accumulator + current.losses, 0);
		let pRecord = this.state.leagues.reduce((accumulator, current) => accumulator + current.pwins, 0) + " - " + this.state.leagues.reduce((accumulator, current) => accumulator + current.plosses, 0);
		return <div>
			<Link to="/" className="link">Home</Link>
			<Theme/>
			<h1><img src={this.state.avatar} />{this.state.username}</h1>
			<h2>2021 Record: {record}</h2>
			<h2>2020 Record: {pRecord} ({this.state.leagues.filter(x => x.pwins + x.plosses !== 0).length} Leagues)</h2>
			<h2>2020: Champ {this.state.leagues.filter(x => x.winner === x.roster_id).length} Runner Up {this.state.leagues.filter(x => x.second === x.roster_id).length}</h2>
			<h2>Total Leagues - {this.state.leagues.length}  Best Ball - {this.state.leagues.filter(x => x.best_ball === 1).length}</h2> 
			<table>
				<thead>
					<tr>
						<th></th>
						<th>League</th>
						<th>2020 Record</th>
						<th>Record</th>
						<th>Fantasy Points</th>
						<th>Fantasy Points Against</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
				{this.state.leagues.sort((a, b) => (a.name > b.name) ? 1 : -1).map(league => 
					<tr key={league.league_id} className="row">
						<td>
							<img src={league.avatar === null ? blankplayer : "https://sleepercdn.com/avatars/thumbs/" + league.avatar} />
						</td>
						<td>
							{league.name}
						</td>
						<td>
							{league.pwins} - {league.plosses} {league.roster_id === league.winner ? 'Champ' : (league.roster_id === league.second ? 'Runner Up' : null)}
						</td>
						<td>
							{league.wins} - {league.losses}
						</td>
						<td>
							{league.fpts}
						</td>
						<td>
							{league.fpts_against}
						</td>
						<td>
							<Link to={"/roster/" + league.league_id + "/" + this.state.username}><button><span className="front">View Roster</span></button></Link>
						</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	}	
}

export default Leagues;