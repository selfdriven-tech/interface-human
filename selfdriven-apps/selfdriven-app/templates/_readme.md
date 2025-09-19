See selfdriven.foundation/shared/templates

https://slfdrvn.io/templates-explorer

https://skillzeb.io/template-explorer

# Examples

## Learning Partner is Validating a Task has been completed.

... milestones[]tasks[].reflections[
{
	"by": "learning-partner",
	"method": "observeration",
	"type": "mandatory",
	"notes": "Has the learner ...",
}]

## Learner is Self verifying a Learning Task has been completed.

... milestones[]tasks[].reflections[
{
	"by": "learner",
	"method": "structured",
	"type": "mandatory",
	"notes": "",
	"structure":
	{
		"description": "What is meant by concept 1?",
		"methods": "text"
	}
},
{
	"by": "learner",
	"method": "structured",
	"type": "mandatory",
	"notes": "",
	"structure":
	{
		"description": "Which of the following are correct?",
		"hint": "Hint 1",
		"methods": "select"
		"options":
		[
			{
				"name": "1",
				"sequence: "1",
				"points: "0",
				"caption": "Caption 1",
			},
			{
				"name": "2",
				"sequence: "2",
				"points: "2",
				"caption": "Caption 2",
			}
		],
		"controllers":
		[
			{
				"type": "if",
				"points": {"comparison": "equal-to", "value": "1"},
				"status": "complete"
			}
		]
	}
}]

