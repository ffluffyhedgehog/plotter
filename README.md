# Plotter

Plotter is a programming language for defining interactive cinema/novel plot, written purely in typescript.

Result of plotter program compilation is a state manipulator that guides users through described plot.
# Features
  - Any amount of possible answers
  - Decision carry-over (previously-made decisions can influence the plot)
  - Variables (that can change on decisions and influence the plot)

Program consists of blocks. Blocks are steps of one's journey through the plot you are describing using this language. One of the blocks must be declared starting, and any number of which can be terminating (end of story).

Each block consist of a strip name (for interactive cinema, to ease resource manipulation), a name, a question, and any amount of possible answers, between which your user chooses.

Each answer consists of its name, text, and a set of possible consequences, one of which must be default.

Consequence consists of name of block it leads to (or "terminate" word if it's the ending), a condition in which it fires (or "default" word) and an effect (an increment or a decrement of a variable).\


# Examples

Below is a basic block declaration.
This block has a question and two answers with consequences and conditions.
`answerOne` has two consequences. Lets look at second one: `AnotherBlock because "drinkedyesteday" with "odour" - 10`, that will be fired if `because` clause is true, and will substract 10 from variable `odour` if fired.
The first one is default, and it fires if no other is.
```
declare block blockName
from strip "stripItsUsing"
asking "How are you today?"
with answers {
  answerOne named "good" leading to [
    AnotherBlock default with "wellness" + 1,
    AnotherBlock because "beersdrinkedyesteday" > 5 with "odour" - 10,
  ],
  secondAnswer named "bad" leading to [
    AnotherBlock default,
    terminate because "sleep" < 4
  ]
};
```

Next is a more complicated example, that shows us some more complicated behaviour.

```
import variables "var", "let", "const";
import strips "somestrip1", "somestrip 2";

declare block SomeBlock
from strip "somestrip1"
asking "What the fuck"
with answers {
  answerOne named "shut up" leading to [
    AnotherBlock default with "var" + 1,
    AnotherBlock because "var" with "var" + 2,
    terminate because "var" > 10 && AnotherBlock.goAway
  ],
  secondAnswer named "go away" leading to [
    AnotherBlock default,
    terminate because "var" > 20
  ]
};

-- some comment
declare block AnotherBlock
from strip "somestrip 2"
asking "What the fuck"
with answers {
  answerOne named "shut up" leading to [
    SomeBlock default,
    terminate because "var" > 2 with "const" + 1
  ],
  unneeededunchosen named "go away" leading to [
    SomeBlock default
  ]
};

mark block SomeBlock starting;
```
What this basic text does is declares 2 blocks 
```
const l = new PlotterStateManipulator(text);

const a = l.getFreshState();
console.log(util.inspect(a, {showHidden: false, depth: null}));
console.log('\n')
console.log('\n')

const b = l.processDecision(a, a.currentBlock.answers[0].name);
console.log(util.inspect(b, {showHidden: false, depth: null}));
console.log('\n')
console.log('\n')

const c = l.processDecision(b, b.currentBlock.answers[0].name);
console.log(util.inspect(c, {showHidden: false, depth: null}));
console.log('\n')
console.log('\n')

const d = l.processDecision(c, c.currentBlock.answers[0].name);
console.log(util.inspect(d, {showHidden: false, depth: null}));
console.log('\n')
console.log('\n')

const e = l.processDecision(d, d.currentBlock.answers[0].name);
console.log(util.inspect(e, {showHidden: false, depth: null}));
console.log('\n')
console.log('\n')
```

