import {Injectable, OnModuleInit} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {LoggerService} from "nest-logger";
import Axios from "axios";
import {RegisteredNodeInstance} from "./types/response";
import {BootstrapNode, NodeType} from "./types";
import {BootstrapNodesContainer} from "./BootstrapNodesContainer";
import {getRandomElement} from "../utils/random-element";

@Injectable()
export class RoundRobinLoadBalancerClient extends NestSchedule implements OnModuleInit {
    private nodeInstances: RegisteredNodeInstance[] = [];
    private selectedNodeIndex: number = 0;
    private initialized: boolean = false;

    constructor(private readonly bootstrapNodesContainer: BootstrapNodesContainer,
                private readonly log: LoggerService) {
        super();
    }

    public getServiceNodeInstance(): RegisteredNodeInstance {
        const serviceNodes = this.nodeInstances.filter(instance => instance.type === NodeType.SERVICE_NODE);
        console.log(serviceNodes);

        if (this.selectedNodeIndex < serviceNodes.length) {
            const result: RegisteredNodeInstance = serviceNodes[this.selectedNodeIndex];
            this.selectedNodeIndex += 1;
            return result;
        } else {
            this.selectedNodeIndex = 0;
            return serviceNodes[this.selectedNodeIndex];
        }
    }

    @Cron("*/10 * * * *", {
        immediate: false,
        waiting: true
    })
    public async refreshInstances(): Promise<void> {
        this.log.info("Refreshing list of registered nodes");
        const randomBootstrapNode: BootstrapNode = getRandomElement(this.bootstrapNodesContainer.getBootstrapNodes());
        this.nodeInstances = (await Axios.get(`http://${randomBootstrapNode.ipAddress}:${randomBootstrapNode.port}/api/v1/discovery/nodes`)).data;
    }

    public async onModuleInit(): Promise<void> {
        await this.refreshInstances();
        this.initialized = true;
    }

    public isLoadBalancerInitialized(): boolean {
        return this.initialized;
    }

}
