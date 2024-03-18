import { createInterface, Interface } from 'readline/promises';

export class InstagramData {
    protected static consoleInterface: Interface = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    public username: string;
    public password: string;
    public targetUsername: string;
    public maxFollowers: number;

    static async getFromConsole() {
        const instance = new InstagramData();
        instance.username = await this.consoleInterface.question("Enter Username/Email: ");
        instance.password = await this.consoleInterface.question("Enter Password: ");
        instance.targetUsername = await this.consoleInterface.question("Enter the username of target account: ");
        instance.maxFollowers = parseInt(await this.consoleInterface.question("Number of maximum accounts to follow: "));
        return instance;
    }

    public static getFromObject(info: InstagramData) {
        const instance = new InstagramData();
        instance.username = info?.username || "";
        instance.password = info?.password || "";
        instance.targetUsername = info?.targetUsername || "";
        instance.maxFollowers = info?.maxFollowers || 0;
        return instance;
    }

    public static getForTesting() {
        const instance = new InstagramData();
        instance.username = "farrukhsial@outlook.com";
        instance.password = "Farrukh@59$";
        instance.targetUsername = "iqrarulhassan";
        instance.maxFollowers = 3;
        return instance;
    }
}