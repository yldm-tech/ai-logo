import { OpenAI } from "ai-logo";

import { renderToStaticMarkup } from "react-dom/server";

document.body.innerHTML = renderToStaticMarkup(<OpenAI size={32} />);
