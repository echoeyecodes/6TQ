import store from '../redux/store'

class StopWatch{
    constructor(){
        this.duration = store.getState().value
        this.start = () =>{
            this.timer = setInterval(() =>{
                this.duration --
                
            }, 1000)
        }

        this.stop = () =>{
            clearInterval(this.timer)
        }

        this.reset = () =>{
            this.stop()
            this.duration = 5
            
        }
    }
}

export default StopWatch