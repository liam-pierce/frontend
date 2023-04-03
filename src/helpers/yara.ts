/* eslint-disable no-template-curly-in-string */
import { editor as Editor, languages as Languages, Position, Range } from 'monaco-editor';

export const yaraDef = {
  defaultToken: 'invalid',
  octaldigits: /-?0o[0-7]+/,
  hexdigits: /-?0x[0-9a-fA-F]+/,
  digits: /-?[0-9]+/,
  hexchars: /([0-9a-fA-F?]{2})+/,
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
  identifiers: /[A-Z_a-z][0-9A-Z_a-z]*/,
  string_names: /[!@#$][0-9A-Z_a-z]*/,
  rule_brackets: /[{}]/,
  regexp_control: /[(){}$^|\-*+?.[\]]/,
  regexp_escapes: /\\[^0-9x\r\nj]/,
  string_escapes: /\\(?:[nrt\\"]|x[0-9A-Fa-f]{2})/,
  operator_chars: /[!%&*+-.:<=>\\^|~]+/,
  operators: [
    '.',
    '..',
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
    ':',
    '='
  ],
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      {
        include: '@whitespace'
      },
      {
        include: '@modules'
      },
      {
        include: '@rules_files'
      },
      {
        include: '@rules'
      }
    ],
    modules: [
      [
        'import',
        {
          token: 'regexp',
          next: '@quoted_string'
        }
      ]
    ],
    rules_files: [
      [
        'include',
        {
          token: 'keyword',
          next: '@quoted_string'
        }
      ]
    ],
    rules: [
      {
        include: '@rule_restrictions'
      },
      {
        include: '@rule_declaration'
      }
    ],
    rule_restrictions: [
      ['global', 'keyword'],
      ['private', 'keyword']
    ],
    rule_declaration: [
      ['rule', 'keyword'],
      [
        /[A-Z_a-z][0-9A-Z_a-z]{0,127}\b/,
        {
          cases: {
            '@keywords': 'invalid',
            '@default': 'type.identifier'
          }
        }
      ],
      [/:/, 'operator', '@rule_tags'],
      [/\{/, '@brackets', '@rule_content']
    ],
    rule_tags: [
      [
        /[A-Z_a-z][0-9A-Z_a-z]{0,127}\b/,
        {
          cases: {
            '@keywords': 'invalid',
            '@default': 'meta.content'
          }
        }
      ],
      [/(?=\{)/, '', '@pop']
    ],
    rule_content: [
      {
        include: '@whitespace'
      },
      [/meta\b/, 'keyword', '@rule_meta_start'],
      [/strings\b/, 'keyword', '@rule_strings_start'],
      [/condition\b/, 'keyword', '@rule_condition_start'],
      [/\}/, '@brackets', '@pop']
    ],
    // Meta
    rule_meta_start: [
      [
        /:/,
        {
          token: 'keyword',
          switchTo: '@rule_meta'
        }
      ]
    ],
    rule_meta: [
      {
        include: '@whitespace'
      },
      [/(meta|strings|condition|\})/, { token: '@rematch', next: '@pop' }],
      [
        /[A-Z_a-z][0-9A-Z_a-z]{0,127}\b/,
        {
          cases: {
            '@keywords': {
              token: 'invalid',
              next: '@meta_assign'
            },
            '@default': {
              token: 'meta.content',
              next: '@meta_assign'
            }
          }
        }
      ],
      [/[^A-Z_a-z \t\r\n]+[^\t\r\n]*$/, 'invalid']
    ],
    meta_assign: [
      [
        /=/,
        {
          token: 'operator',
          switchTo: '@meta_values'
        }
      ],
      [
        /[^= \t\r\n]+[^\t\r\n]*$/,
        {
          token: 'invalid',
          switchTo: '@meta_values'
        }
      ]
    ],
    meta_values: [
      [
        /(?=")/,
        {
          token: 'string',
          switchTo: '@quoted_string'
        }
      ], // strings
      [/@hexdigits/, 'number', '@pop'], // integers
      [/@octaldigits/, 'number', '@pop'], // integers
      [/@digits/, 'number', '@pop'], // integers
      [
        /([A-Z_a-z][0-9A-Z_a-z]{0,127})(.*$)/,
        [
          {
            cases: {
              'true|false': {
                token: 'keyword',
                next: '@pop'
              },
              '@default': {
                token: 'invalid',
                next: '@pop'
              }
            }
          },
          {
            token: 'invalid'
          }
        ]
      ] // booleans
    ],
    // Strings
    rule_strings_start: [
      [
        /:/,
        {
          token: 'keyword',
          switchTo: '@rule_strings'
        }
      ]
    ],
    rule_strings: [
      {
        include: '@whitespace'
      },
      [/(meta|strings|condition|\})/, { token: '@rematch', next: '@pop' }],
      [
        /[$][0-9A-Z_a-z]*\b/,
        {
          token: 'attribute.name',
          next: '@strings_assign'
        }
      ],
      [
        /[$]/,
        {
          token: 'attribute.name',
          next: '@strings_assign'
        } // anonymous name
      ],
      [
        /(xor)\s*(\()\s*((?:0x[0-9A-Fa-f]{1,2}|0o[0-7]{1,3}|[0-9]{1,3})(?:\s*-\s*(?:0x[0-9A-Fa-f]{1,2}|0o[0-7]{1,3}|[0-9]{1,3}))?)\s*(\))/,
        ['keyword', 'delimiter', 'number', 'delimiter']
      ],
      [
        /(base64|base64wide)(\()("(?:\\(?:[nrt\\"]|x[0-9A-Fa-f]{2})|[\x20\x21\x23-\x5B\x5D-\x7E]){1,64}")(\))/,
        ['keyword', 'delimiter', 'string', 'delimiter']
      ],
      [/(nocase|wide|ascii|fullword|private|xor|base64|base64wide)\b/, 'keyword'],
      [/[^$ \t\r\n]+[^\t\r\n]*$/, 'invalid']
    ],
    strings_assign: [
      [
        /=/,
        {
          token: 'operator',
          switchTo: '@strings_values'
        }
      ],
      [
        /[^= \t\r\n]+[^\t\r\n]*$/,
        {
          token: 'invalid',
          switchTo: '@strings_values'
        }
      ]
    ],
    strings_values: [
      [
        /(?=")/,
        {
          token: 'string',
          switchTo: '@quoted_string'
        }
      ], // strings
      [
        /\//,
        {
          token: 'regexp',
          switchTo: '@regexp'
        }
      ], // regular expressions
      [
        /\{/,
        {
          token: 'delimiter',
          switchTo: '@hex_string'
        }
      ], // hex strings
      [
        /[^{/"]+$/,
        {
          token: 'invalid',
          next: '@pop'
        }
      ] // premature end of line
    ],
    // Condition
    rule_condition_start: [
      [
        /:/,
        {
          token: 'keyword',
          switchTo: '@rule_condition'
        }
      ]
    ],
    rule_condition: [
      {
        include: '@whitespace'
      },
      [/(meta|strings|condition|\})/, { token: '@rematch', next: '@pop' }],
      [/(@string_names)(\[)(@digits)(])/, ['attribute.name', 'delimiter', 'number', 'delimiter']],
      [/(@string_names)(\*?)/, ['attribute.name', 'operator']],
      [
        /@identifiers/,
        {
          cases: {
            'and|or|not': {
              token: 'operator'
            },
            'all|any': {
              token: 'number'
            },
            'global|private|rule|meta|strings|condition|nocase|ascii|wide|base64|base64wide|xor|fullword': {
              token: 'invalid'
            },
            '@keywords': {
              token: 'keyword'
            },
            '@default': {
              token: 'attribute.name'
            }
          }
        }
      ],
      [',', 'delimiter'],
      [
        /@operator_chars/,
        {
          cases: {
            '=': {
              token: 'invalid'
            },
            '@operators': {
              token: 'operators'
            },
            '@default': {
              token: 'invalid'
            }
          }
        }
      ],
      [/@hexdigits/, 'number'],
      [/@octaldigits/, 'number'],
      [/@digits/, 'number'],
      [
        /[()]/,
        {
          token: '@brackets'
        }
      ],
      [
        /(?=")/,
        {
          token: 'string',
          next: '@quoted_string'
        }
      ], // strings
      [
        /\//,
        {
          token: 'regexp',
          next: '@regexp'
        }
      ], // regular expressions
      [/[^A-Z_a-z }\t\r\n]+[^}\t\r\n]*$/, 'invalid']
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
    quoted_string: [
      [/"([^"\\]|@string_escapes)*$/, 'invalid', '@pop'],
      [
        /"/,
        {
          token: 'string',
          bracket: '@open',
          switchTo: '@quoted_chars'
        }
      ]
    ],
    quoted_chars: [
      [/[^\\"]+/, 'string'],
      [/@string_escapes/, 'escape'],
      [/\\./, 'invalid'],
      [
        /"/,
        {
          token: 'string',
          bracket: '@close',
          next: '@pop'
        }
      ]
    ],
    regexp: [
      [/(\{)([0-9]+|[0-9]+,(?:[0-9]+)?|,[0-9]+)(\})/, ['delimiter', 'number.float', 'delimiter']],
      [/\{/, 'regexp'],
      [
        /(\[)(\^?)(-?)(?=(?:[^\r\n\]\\/]|\\.)+\])/,
        [
          {
            token: 'delimiter',
            bracket: '@open',
            next: '@regexp_range'
          },
          'operator',
          'regexp'
        ]
      ],
      [/[^\\/\r\n()[\]{}]/, 'regexp'],
      [
        /(\/)(i?s?)/,
        [
          {
            token: 'regexp',
            bracket: '@close',
            next: '@pop'
          },
          'keyword.other'
        ]
      ],
      [/@regexp_escapes/, 'string'],
      [/@regexp_control/, 'delimiter'],
      [/(.+$)/, 'invalid', '@pop']
    ],
    regexp_range: [
      [
        /(-?)(\])/,
        [
          'regexp',
          {
            token: 'delimiter',
            bracket: '@close',
            next: '@pop'
          }
        ]
      ],
      [/-/, 'delimiter'],
      [/@regexp_escapes/, 'string'],
      [/[^\\\]\r\n]/, 'regexp']
    ],
    hex_string: [
      {
        include: '@whitespace'
      },
      [/}/, 'delimiter', '@pop'], // End of hex string
      [/(meta|strings|condition|\})/, { token: '@rematch', next: '@pop' }],
      [/\?\?/, 'constant'], // hex values with wildcard (?)
      [/(\?)([0-9A-Fa-f])/, ['constant', 'string']],
      [/([0-9A-Fa-f])(\?)/, ['string', 'constant']],
      ['@hexchars', 'string'], // hex values
      [/[|]/, 'delimiter'], // alternate values
      [/(\[)\s*(?:([1-9][0-9]*|[0-9]*\s*-|[0-9]+\s*-\s*[0-9]*)\s*(\]))/, ['delimiter', 'number', 'delimiter']] // hex jump
    ]
  }
};

export const yaraConfig = {
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
    {
      open: '"',
      close: '"',
      notIn: ['string', 'regexp', 'comment']
    },
    {
      open: '/',
      close: '/',
      notIn: ['string', 'regexp', 'comment']
    },
    {
      open: '{',
      close: '}',
      notIn: ['string', 'comment']
    },
    {
      open: '[',
      close: ']',
      notIn: ['string', 'comment']
    },
    {
      open: '(',
      close: ')',
      notIn: ['string', 'comment']
    }
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

/**
 * The following configuration is based on the VSCode extension for the YARA pattern matching language made by infosec-intern on Github
 *
 * Source :
 *  - Author: infosec-intern
 *  - Extension: infosec-intern.yara
 *  - Repository: https://github.com/infosec-intern/vscode-yara
 */

type RegisterYaraCompletionItemProviderProps = {
  editor: typeof Editor;
  languages: typeof Languages;
};

type Snippet = {
  prefix: string;
  description: string;
  insert: string | string[];
  detail: string;
  kind: Languages.CompletionItemKind;
};

export const registerYaraCompletionItemProvider = (monaco: RegisterYaraCompletionItemProviderProps) => ({
  provideCompletionItems: (
    model: Editor.ITextModel,
    position: Position,
    context: Languages.CompletionContext
  ): Languages.CompletionList => {
    const word: Editor.IWordAtPosition = model.getWordUntilPosition(position);
    const range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
    const kinds = monaco.languages.CompletionItemKind;
    const rules = monaco.languages.CompletionItemInsertTextRule;

    const snippets: Snippet[] = [
      {
        prefix: 'import',
        description: 'Import',
        insert: 'import "${1|pe,elf,cuckoo,magic,hash,math,dotnet,time,console,vt|}"',
        detail: 'Import a YARA module',
        kind: kinds.Module
      },
      {
        prefix: 'include',
        description: 'Include',
        insert: 'include "external_rules.yara"',
        detail: 'Include an external YARA file',
        kind: kinds.Module
      },
      {
        prefix: 'for_of',
        description: 'for..of',
        insert: ['for ${1:any} of ${2:them} : (', '\t${3:boolean_expression}', ')'],
        detail: 'Apply the same condition to many strings',
        kind: kinds.Method
      },
      {
        prefix: 'for_in',
        description: 'for..in',
        insert: ['for ${1:any i} in ( ${2:them} ) : (', '\t${3:boolean_expression}', ')'],
        detail: 'Loop over items',
        kind: kinds.Method
      },
      {
        prefix: 'any',
        description: 'any',
        insert: 'any of ${them}',
        detail: 'String set keyword: any',
        kind: kinds.Operator
      },
      {
        prefix: 'all',
        description: 'all',
        insert: 'all of ${them}',
        detail: 'String set keyword: all',
        kind: kinds.Operator
      },
      {
        prefix: 'header_pe',
        description: 'PE Header',
        insert: 'uint16(0) == 0x5A4D ',
        detail: 'Generate a condition to check for a PE file header',
        kind: kinds.Variable
      },
      {
        prefix: 'header_elf',
        description: 'ELF Header',
        insert: 'uint32(0) == 0x464C457F ',
        detail: 'Generate a condition to check for an ELF file header',
        kind: kinds.Variable
      },
      {
        prefix: 'header_macho',
        description: 'Mach-O Header',
        insert: 'uint32(0) == 0xFEEDFACF ',
        detail: 'Generate a condition to check for a Mach-O file header',
        kind: kinds.Variable
      },
      {
        prefix: '$s',
        description: 'string',
        insert: ['\\$s = "${CLIPBOARD/([\\"\\\\])/\\$1/g}" ${1|ascii,wide|} ${2:fullword}'],
        detail: 'Generate a string with the escaped content of your clipboard',
        kind: kinds.Snippet
      },
      {
        prefix: '$re',
        description: 'regex',
        insert: [
          '\\$re = /${CLIPBOARD/([\\\\/\\\\^\\\\$\\|(){}\\[\\]*+?\\\\.])|(\\n)|(\\t)|(\\r)/${1:+\\\\}${1}${2:+\\\\n}${3:+\\\\t}${4:+\\\\r}/g}/'
        ],
        detail: 'Generate a regex string with the escaped content of your clipboard',
        kind: kinds.Snippet
      },
      {
        prefix: 'pasteString',
        description: 'pasteString',
        insert: ['${CLIPBOARD/([\\"\\\\])/\\$1/g}'],
        detail: 'Paste current clipboard escaped for yara strings',
        kind: kinds.Snippet
      },
      {
        prefix: 'pasteRegex',
        description: 'pasteRegex',
        insert: [
          '${CLIPBOARD/([\\\\/\\\\^\\\\$\\|(){}\\[\\]*+?\\\\.])|(\\n)|(\\t)|(\\r)/${1:+\\\\}${1}${2:+\\\\n}${3:+\\\\t}${4:+\\\\r}/g}'
        ],
        detail: 'Paste current clipboard escaped for yara regex',
        kind: kinds.Snippet
      },
      {
        prefix: '$c',
        description: 'hex',
        insert: ['\\$c ={${CLIPBOARD/[\t]*(.+?)\\n/${1}\n\t\t\t  /g}}'],
        detail: 'Generate a hex-string with the content of your clipboard',
        kind: kinds.Snippet
      },
      {
        prefix: 'condition',
        description: '',
        insert: ['condition:', '\t${6:any of them}'],
        detail: 'Generate a condition section (YARA)',
        kind: kinds.Snippet
      },
      {
        prefix: 'meta',
        description: '',
        insert: ['meta:', '\t${2:KEY} = ${3:"VALUE"}'],
        detail: 'Generate a meta section (YARA)',
        kind: kinds.Snippet
      },
      {
        prefix: 'strings',
        description: '',
        insert: ['strings:', '\t$${4:name} = ${5|"string",/regex/,{ HEX }|}'],
        detail: 'Generate a strings section (YARA)',
        kind: kinds.Snippet
      },
      {
        prefix: 'rule',
        description: '',
        insert: [
          'rule ${1:my_rule} {',
          '\tmeta:',
          '\t\t${2:KEY} = ${3:"VALUE"}',
          '\tstrings:',
          '\t\t$${4:name} = ${5|"string",/regex/,{ HEX }|}',
          '\tcondition:',
          '\t\t${6:any of them}',
          '}'
        ],
        detail: 'Generate a rule skeleton (YARA)',
        kind: kinds.Snippet
      }
    ];

    const parseInsertText = snippet =>
      'insert' in snippet
        ? typeof snippet.insert === 'string'
          ? snippet.insert
          : Array.isArray(snippet.insert)
          ? snippet.insert.join('\n')
          : `${JSON.stringify(snippet.insert)}`
        : '';

    const suggestions: Languages.CompletionItem[] = snippets.map(
      snippet =>
        ({
          label: {
            label: 'prefix' in snippet ? snippet.prefix : '',
            description: 'description' in snippet ? snippet.description : ''
          },
          insertText: parseInsertText(snippet),
          kind: 'kind' in snippet ? snippet.kind : kinds.Text,
          detail: 'detail' in snippet ? snippet.detail : '',
          documentation: {
            value: `<pre>${parseInsertText(snippet)}</pre>`,
            supportHtml: true,
            supportThemeIcons: true
          },
          insertTextRules: rules.InsertAsSnippet,
          range: range
        } as Languages.CompletionItem)
    );
    return { suggestions };
  }
});
