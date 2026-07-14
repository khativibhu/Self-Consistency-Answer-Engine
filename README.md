### Self-Consistency-Answer-Engine
It is a CLI-based LLM application that generates consistent answers.

### How the Project Works?
It take outputs of two ai models and give it to the final evaluator model(GEMINI), which compares the two ouput and gives final result.

### Models used
Tencent hy3 model and gemini-3.1-flash-lite model.

### How the self-consistency flow is implememented?

User Prompt   --->   Model 1   ------> |-------------------------|  
   |                                   |    Evaluator Model      | 
   |                                   |      (Gemini)           | --------------> Final Output
   |                                   |                         |
   -------------->  Model 2   -------> |-------------------------|                        
