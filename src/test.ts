import fsp from "fs/promises";
import { Bot } from "./web-models/bot";
import { InstagramData } from "./web-models/instagram-data";

async function main() {
    const data = InstagramData.getForTesting();

    console.log("Starting the bot.");
    const bot = new Bot(data);
    await bot.start();

    console.log("Logging In");
    await bot.login();

    // while (!await data.isLoggedIn()) 
    //     console.log("Please login to start further processing.");
    
    // console.log("Starting to follow.");
    // const followedCount = await bot.follower.startFollowing(data.maxFollowers);
    // console.log(`You are now following ${followedCount} followers of ${data.targetUsername}. Enjoy!`);

    const followers = await bot.follower.getList();
    console.log(followers);
    fsp.writeFile(
        "result.json",
        JSON.stringify(followers)
    );

    await bot.close();
}


main();