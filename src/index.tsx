import * as React from "react";
import * as ReactDOM from "react-dom";
import {TinaProvider, TinaCMS} from "tinacms";

import {Main} from "./modules/main";

const cms = new TinaCMS();

ReactDOM.render(
  (
    <TinaProvider cms={cms}>
      <Main />
    </TinaProvider>
  ),
  document.getElementById("app")
);
