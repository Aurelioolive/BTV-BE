import { Injectable, HttpService } from '@nestjs/common';
import { ListOfTweetsModel } from './list-of-tweets.model'
import { AuthorData } from './author-data.model'
import { Logger } from '@nestjs/common';

const logger = new Logger('AppService');

@Injectable()
export class AppService {
  constructor(private readonly http: HttpService){}

  async getTwitterList(hashtag:string): Promise<any> {
    const twitterApi:string = `https://api.twitter.com/2/tweets/search/recent?query=%23${hashtag}&user.fields=id,name,profile_image_url,username,verified,withheld&expansions=author_id&max_results=100`;
    const twitterToken:string = 'Bearer AAAAAAAAAAAAAAAAAAAAAMENHAEAAAAAuDB%2BejKwo%2BA4KwOViBu27YKLxb4%3DwC01kq6pAFsETg3LxqBrWHy1Uhedos3N7UNKKbsoPRlidIbXzI';

    logger.log(`Searching Tweets with <<< #${hashtag} >>>`)

    const dataOnApi = await this.http.get<any>(twitterApi,
      {
        headers: {
          "Authorization" : twitterToken
        },
      }).toPromise()
    .then(r => {
      return r.data;
    }).catch(error => {
      console.log(Promise.reject(error))
      return null;
    });

    const usersData = dataOnApi.includes.users;
    const tweetsData = dataOnApi.data;

    let response = new ListOfTweetsModel;
    response.tweets = []

    for (let i = 0; i < tweetsData.length; i++) {
      response.tweets.push({
        author:this.getUserDataById(usersData, tweetsData[i].author_id),
        tweet_id:tweetsData[i].id,
        tweet_text:tweetsData[i].text,
      })
    }
    
    return response;
  }

  private getUserDataById(usersData:any, idToSearch:string):AuthorData {
    const user = usersData.filter(function( obj ) {
      return (obj.id == idToSearch);
    });

    return {
      author_id: user[0].id,
      author_image:user[0].profile_image_url.replace("normal", "400x400"),
      author_name:user[0].name,
      auhor_username:user[0].username,  
    }
  }
}
