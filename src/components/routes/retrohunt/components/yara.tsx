import Editor, { loader } from '@monaco-editor/react';
import { Skeleton, useTheme } from '@mui/material';
import useAppTheme from 'commons/components/app/hooks/useAppTheme';
import { useEffectOnce } from 'commons/components/utils/hooks/useEffectOnce';
import 'moment/locale/fr';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactResizeDetector from 'react-resize-detector';
import { DEFAULT_RETROHUNT, Retrohunt } from '.';

loader.config({ paths: { vs: '/cdn/monaco_0.35.0/vs' } });

const yaraDef = {
  defaultToken: '',
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  keywords: [
    'all',
    'and',
    'any',
    'ascii',
    'at',
    'base64',
    'base64wide',
    'condition',
    'contains',
    'endswith',
    'entrypoint',
    'false',
    'filesize',
    'for',
    'fullword',
    'global',
    'import',
    'icontains',
    'iendswith',
    'iequals',
    'in',
    'include',
    'int16',
    'int16be',
    'int32',
    'int32be',
    'int8',
    'int8be',
    'istartswith',
    'matches',
    'meta',
    'nocase',
    'none',
    'not',
    'of',
    'or',
    'private',
    'rule',
    'startswith',
    'strings',
    'them',
    'true',
    'uint16',
    'uint16be',
    'uint32',
    'uint32be',
    'uint8',
    'uint8be',
    'wide',
    'xor',
    'defined'
  ],
  typeKeywords: [
    'any',
    'of',
    'them',
    'contains',
    'icontains',
    'startswith',
    'istartswith',
    'endswith',
    'iendswith',
    'iequals',
    'matches',
    'and',
    'or'
  ],
  common: [
    [
      /[a-z_$][\w$]*/,
      {
        cases: {
          '@typeKeywords': 'keyword',
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }
    ],
    { include: '@whitespace' },
    { include: '@brackets' },
    { include: '@numbers' },
    { include: '@strings' },
    { include: '@tags' }
  ],
  escapes: /(\\[nrt\\"]|x\d{2})/,

  operators: [
    '.',
    '-',
    '~',
    '*',
    '\\',
    '%',
    '+',
    '-',
    '>>',
    '<<',
    '&',
    '^',
    '|',
    '<',
    '<=',
    '>',
    '>=',
    '==',
    '!=',
    '='
  ],
  // The main tokenizer for our languages
  tokenizer: {
    root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],

    common: [
      // Variables
      [/[$@][\w_]*/, 'attribute.name'],
      // identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@typeKeywords': 'keyword',
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }
      ],

      // whitespace
      { include: '@whitespace' },

      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [/(\/(?:[^\\/]|\\.)+\/)([si]{1,2})?[ \t\n\r$]*/, 'regexp'],

      // delimiters and operators
      [/[()[\]]/, '@brackets'],

      // numbers
      [/(@digits)[eE]([-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)/, 'number.hex'],
      [/0[oO]?(@octaldigits)/, 'number.octal'],
      [/0[bB](@binarydigits)/, 'number.binary'],
      [/(@digits)/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // strings
      [/"/, 'string', '@string_double']
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/"/, 'string', '@pop']
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' }
    ]
  }
};

const yaraConfig = {
  comments: {
    // symbol used for single line comment. Remove this entry if your language does not support line comments
    lineComment: '//',
    // symbols used for start and end a block comment. Remove this entry if your language does not support block comments
    blockComment: ['/*', '*/']
  },
  // symbols used as brackets
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  // symbols that are auto closed when typing
  autoClosingPairs: [
    { open: '"', close: '"', notIn: ['string', 'annotation'] },
    { open: '/', close: '/', notIn: ['string', 'annotation'] },
    { open: '{', close: '}', notIn: ['string', 'annotation'] },
    { open: '[', close: ']', notIn: ['string', 'annotation'] },
    { open: '(', close: ')', notIn: ['string', 'annotation'] }
  ],
  // symbols that that can be used to surround a selection
  surroundingPairs: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
    ['"', '"'],
    ['/', '/']
  ]
};

type Props = {
  retrohunt: Retrohunt;
  isReadyOnly?: boolean;
  onYaraSignatureChange?: (value: string) => void;
  reload?: () => void;
};

export const RetrohuntYara = ({
  retrohunt = { ...DEFAULT_RETROHUNT },
  isReadyOnly = false,
  onYaraSignatureChange = () => null,
  reload = () => null
}: Props) => {
  const { t, i18n } = useTranslation(['retrohunt']);
  const theme = useTheme();
  const containerEL = useRef<HTMLDivElement>();
  const { isDark: isDarkTheme } = useAppTheme();

  useEffectOnce(() => {
    if (!retrohunt?.yara_signature) reload();
    // I cannot find a way to hot switch monaco editor's locale but at least I can load
    // the right language on first load...
    if (i18n.language === 'fr') {
      loader.config({ 'vs/nls': { availableLanguages: { '*': 'fr' } } });
    } else {
      loader.config({ 'vs/nls': { availableLanguages: { '*': '' } } });
    }
  });

  const beforeMount = monaco => {
    if (!monaco.languages.getLanguages().some(({ id }) => id === 'yara')) {
      // Register a new language
      monaco.languages.register({ id: 'yara' });
      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('yara', yaraDef);
      // Set the editing configuration for the language
      monaco.languages.setLanguageConfiguration('yara', yaraConfig);
    }
  };

  const onMount = editor => {
    editor.focus();
  };

  return retrohunt ? (
    <div
      ref={containerEL}
      style={{
        flexGrow: 1,
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <ReactResizeDetector handleHeight handleWidth targetRef={containerEL}>
          {({ width, height }) => (
            <div ref={containerEL}>
              {retrohunt.yara_signature !== null ? (
                <>
                  <Editor
                    language="yara"
                    width={width}
                    height={height}
                    theme={isDarkTheme ? 'vs-dark' : 'vs'}
                    loading={t('loading.yara')}
                    value={retrohunt.yara_signature}
                    onChange={value => onYaraSignatureChange(value)}
                    beforeMount={beforeMount}
                    onMount={onMount}
                    options={{ links: false, readOnly: isReadyOnly }}
                  />
                </>
              ) : (
                <Skeleton width={width} height={height} variant="rectangular" animation="wave" />
              )}
            </div>
          )}
        </ReactResizeDetector>
      </div>
    </div>
  ) : (
    <Skeleton style={{ height: '2.5rem' }} />
  );
};