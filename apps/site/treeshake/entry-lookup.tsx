import { ProviderIcon } from "@yldm-tech/ai-logo";

import { renderToStaticMarkup } from "react-dom/server";

document.body.innerHTML = renderToStaticMarkup(<ProviderIcon provider={"openai"} size={32} />);
