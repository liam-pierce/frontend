import createFastContext from '../toc2/createFastContext';

const { Provider, useStore } = createFastContext({
  first: '',
  last: '',
  option: {
    middle: ''
  }
});

const TextInput = ({ value }: { value: 'first' | 'last' }) => {
  const [fieldValue, setStore] = useStore(store => store[value]);
  return (
    <div className="field">
      {value}: <input value={fieldValue} onChange={e => setStore({ [value]: e.target.value })} />
    </div>
  );
};

const TextInput2 = () => {
  const [fieldValue, setStore] = useStore(store => store.option.middle);
  return (
    <div className="field">
      {'Middle'}: <input value={fieldValue} onChange={e => setStore({ option: { middle: e.target.value } })} />
    </div>
  );
};

const Display = ({ value }: { value: 'first' | 'last' }) => {
  const [fieldValue] = useStore(store => store[value]);
  return (
    <div className="value">
      {value}: {fieldValue}
    </div>
  );
};

const Display2 = () => {
  const [fieldValue] = useStore(store => store.option.middle);
  return (
    <div className="value">
      {'Middle'}: {fieldValue}
    </div>
  );
};

const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
      <TextInput2 />
    </div>
  );
};

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
      <Display2 />
    </div>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

function App() {
  return (
    <Provider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </Provider>
  );
}

export default App;
