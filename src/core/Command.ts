import Pass from "./Pass.js";
import Pipeline from "./Pipeline.js";
import Buffer from "./Buffer.js";
import BindGroup from "./BindGroup.js";

class Command {
  public pass?: Pass;
  public pipeline?: Pipeline;

  public vertexBuffers?: Buffer[];
  public indexBuffer?: Buffer;
  public bindGroups?: BindGroup[];

  public count?: number;
  public instances?: number;

  public dispatch?: number | [number, number?, number?];

  constructor(options: Command) {
    Object.assign(this, options);
  }
}

export default Command;
