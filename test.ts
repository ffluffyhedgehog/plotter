import { PlotterStateManipulator } from "./runner";
import * as util from "util";

const text = `
import variables "somevariable", "asasdasd", "asdasdasd";
import strips "someshit", "someshit 2";

declare block SomeBlock
from strip "someshit"
asking "What the fuck"
with answers {
  shutUp named "shut up" leading to [
    AAAAAAAAAAAAaa default with "somevariable" + 1,
    AAAAAAAAAAAAaa because "somevariable" with "somevariable" + 2,
    terminate because "somevariable" > 10 && AAAAAAAAAAAAaa.goAway
  ],
  goAway named "go away" leading to [
    AAAAAAAAAAAAaa default,
    terminate because "somevariable" > 20
  ]
};

-- some comment
declare block AAAAAAAAAAAAaa
from strip "someshit 2"
asking "What the fuck"
with answers {
  shutUp named "shut up" leading to [
    SomeBlock default,
    terminate because "somevariable" > 2 with "asasdasd" + 1
  ],
  goAway named "go away" leading to [
    SomeBlock default
  ]
};

mark block SomeBlock starting;`;

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