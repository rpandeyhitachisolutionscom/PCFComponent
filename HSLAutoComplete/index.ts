import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import {AutoCompleteComponent} from './AutoCompleteComponent';

export class AutoComplete implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    notifyOutputChanged: () => void;
    rootContainer: HTMLDivElement;
    selectedValue: number | null;
    context: ComponentFramework.Context<IInputs>;
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this.notifyOutputChanged = notifyOutputChanged;
        this.rootContainer = container;
        this.context = context;
    }


    onChange = (newValue: string | undefined): void => {
        this.context.parameters.value.raw = this.context.parameters.value.attributes?.Options.find(d=>d.Label==newValue)?.Value||0;
        this.selectedValue = this.context.parameters.value.attributes?.Options.find(d=>d.Label==newValue)?.Value||0;
        this.notifyOutputChanged();
   };
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        const { value } = context.parameters;
        if (value && value.attributes) {
            ReactDOM.render(
                React.createElement(AutoCompleteComponent, {
                    label: value.attributes.DisplayName,
                    options: value.attributes.Options,
                    value: value.raw,
                    onChanges: this.onChange,
                    context:this.context
                }),
                this.rootContainer,
            );
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        return { value: this.selectedValue } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        ReactDOM.unmountComponentAtNode(this.rootContainer);
    }
}
