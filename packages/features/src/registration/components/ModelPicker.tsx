import { Picker } from '@react-native-picker/picker';

export type ModelPickerOption = {
  label: string;
  value: string;
};

type ModelPickerProps = {
  onValueChange: (value: string) => void;
  options: ModelPickerOption[];
  placeholderLabel: string;
  selectedValue: string;
};

export function ModelPicker({ onValueChange, options, placeholderLabel, selectedValue }: ModelPickerProps) {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => onValueChange(String(itemValue))}
      style={{ flex: 1, marginHorizontal: -8 }}
      dropdownIconColor="#4b555a"
    >
      <Picker.Item label={placeholderLabel} value="" color="#9aa4a9" />
      {options.map((option) => (
        <Picker.Item key={option.value} label={option.label} value={option.value} color="#1f2529" />
      ))}
    </Picker>
  );
}
