import * as React from 'react';
import { useState }  from 'react';
import { ComboBox, IComboBox, type IComboBoxOption, type IComboBoxStyles } from '@fluentui/react';
import { IInputs } from './generated/ManifestTypes';
const comboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 300 } };
export interface AutoCompleteComponentProps {
    label: string;
    value: number | null;
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    onChanges: (newValue: string | undefined) => void;
    context: ComponentFramework.Context<IInputs>
}

export const AutoCompleteComponent = React.memo((props: AutoCompleteComponentProps) => {
   
    const [option,setOptions] = useState<IComboBoxOption[]>([]);
    const [filtoption,setFiltOptions] = useState<IComboBoxOption[]>([]);
    const [value,setValue] = useState<string | null>();
    const [key,setKey] = useState<string|number|null>();
    const optionSetvalue :IComboBoxOption[] = [];
    console.log("Roshan " +props.label);
    React.useEffect(()=>{
        const optionSet = props.options;
   if(optionSet){
    // const optionSetValue = optionSet.map(d=>d.Label) as IComboBoxOption;
    
    optionSet.forEach(d=>{
        optionSetvalue.push({
            text:d.Label,key:d.Value
        })
    })
    if(props.value){
        const selectedKey = optionSetvalue.find(d=>d.key ==props.value);
        setKey(selectedKey?.key);
    }

    setOptions(optionSetvalue);
    setValue(props.value?.toString());
   }
    },[value])

    const filterStates = (options: string[], { inputValue }: { inputValue: string }) => {
        return options.filter((option) =>
            option.toLowerCase().startsWith(inputValue.toLowerCase())
        );
    };

    const inputChange = (event: React.SyntheticEvent, newValue: string | null) => {
        setValue(newValue);
        if (newValue) {
            const selectedOption = props.options.find(
                (option) => option.Label === newValue
            );
            if (selectedOption) {
                props.onChanges(selectedOption.toString());
            }
            props.context.parameters.value.raw = selectedOption?.Value||0;
        }
    };
 
    const handleChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        setValue(option?.text.toString());
        const selectedOption = props.options.find(
            (option1) => option1.Label === option?.text.toString()
        );
       setKey(option?.key);
       console.log(key);
        if(option?.text.toString()==''){
            setOptions(optionSetvalue);
        }
        else{
            const t:string = option?.text.toString()||'';
            const op = optionSetvalue.filter((option1) =>
                option1.text.toLowerCase().startsWith(t)
            );
            setOptions(op); 
        }
        
        if (option) {
          props.onChanges(option.text.toString());

        }
      };

    function handleInputChnage(text: string): void {
        if(text.toString()==''){
            const optionSet = props.options;
          if(optionSet){
          // const optionSetValue = optionSet.map(d=>d.Label) as IComboBoxOption;
    
          optionSet.forEach(d=>{
            optionSetvalue.push({
            text:d.Label,key:d.Value
           })
        })
   }
            setOptions(optionSetvalue);
        }
        else{
            const optionSet = props.options;
   if(optionSet){
    // const optionSetValue = optionSet.map(d=>d.Label) as IComboBoxOption;
    
    optionSet.forEach(d=>{
        optionSetvalue.push({
            text:d.Label,key:d.Value
        })
    })
   }
            const t:string = text.toString()||'';
            const op = optionSetvalue.filter((option1) =>
                option1.text.toLowerCase().startsWith(t)
            );
            setOptions(op); 
        }
        
    }

    return (
<ComboBox
        label="Select A State"
        options={option}
        styles={comboBoxStyles}
        allowFreeInput
        autoComplete="on"
        onChange={handleChange}
        onInputValueChange={handleInputChnage}
        selectedKey={key}
      />
    );

});
AutoCompleteComponent.displayName = 'AutoCompleteComponent';