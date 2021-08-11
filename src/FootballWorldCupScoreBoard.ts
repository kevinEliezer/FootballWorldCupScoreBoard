import { Match } from "./Match";
import { Team } from "./Team";

export class FootballWorldCupScoreBoard {

  private record = Array<Match>();
  private matches = new Map<string, Match>();

  lastGameId = 0;

  private getNewGameIdentifier(): string {
    this.lastGameId += 1;
    return this.lastGameId.toString();
  }

  newGame(hostTeam: Team, awayTeam: Team): string {
    const matchId = this.getNewGameIdentifier();
    const match = new Match(matchId, hostTeam, awayTeam);
    this.matches.set(matchId, match);
    return matchId;
  }

  getMatchTotalScore(gameId: string): number | undefined {
    return this.matches.get(gameId)?.getTotalScore();
  }

  getGameScore(gameId: string): Array<number> | undefined {
    return this.matches.get(gameId)?.getScore();
  }


  finishGame(gameId: string): Match | undefined {
    const match = this.matches.get(gameId);

    if (match) {
      this.record.push(match);
      this.matches.delete(gameId);
    }

    return match
  }

  getGame(gameId: string): Match | undefined {
    return this.matches.get(gameId);
  }

  findFinishedGame(gameId: string): Match | undefined {
      return this.record.find( match => match.getId() === gameId );
  }

  updateGame(gameId: string, score: [number, number]): Match | undefined {
    if (score[0] < 0 || score[1] < 0) {
      return
    }

    const match = this.matches.get(gameId);

    if (match) {
      match.updateScore(score);
    }

    return match;
  }

  getMatchSummary(): (Match | undefined)[] {
    return [ ...this.matches.keys() ]
      .map(matchId => { return { "id": matchId, "score": this.getMatchTotalScore(matchId) }})
      .sort( function(a, b) {
        const a_score = a.score || -1;
        const b_score = b.score || -1;

        if (a_score > b_score) {
          return -1;
        }
        if (a.id < b.id) {
          return 1;
        }
        return 0
    })
    .map(match => { return this.getGame(match.id)} )
  }
}
