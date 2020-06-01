import Axios from 'axios'

class QuestionHelperClass{
    constructor(){
        this.questions = []
    }

    fetchAllQuestions(){
        return new Promise(async (resolve, reject) =>{
            const {data} = await Axios.get('http://192.168.43.31:3001/live-event');
            this.questions = [...data.questionData]
            resolve()
        })  
    }

    advanceQuestionByIndex(index){
        return this.questions[index]
    }


}

export default QuestionHelperClass