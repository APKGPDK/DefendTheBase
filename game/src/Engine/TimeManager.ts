
export class TimeManager {
    private lastTime: Date;
    private elapsedMiliseconds: number = 0;
    constructor() {

    }

    tick() {
        if(this.lastTime) {
            const currentTime = new Date
            this.elapsedMiliseconds += currentTime.getTime() - this.lastTime.getTime()
            this.lastTime = currentTime
        } else {
            this.lastTime = new Date
        }
    }

    getElapsedMiliseconds() {
        return this.elapsedMiliseconds
    }


}