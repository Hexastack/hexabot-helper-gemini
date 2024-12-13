/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { HelperSetting } from '@/helper/types';
import { SettingType } from '@/setting/schemas/types';

export const GEMINI_HELPER_NAME = 'gemini-helper';

export const GEMINI_HELPER_NAMESPACE = 'gemini_helper';

export default [
  {
    label: 'token',
    group: GEMINI_HELPER_NAMESPACE,
    type: SettingType.secret,
    value: '',
  },
  {
    label: 'model',
    group: GEMINI_HELPER_NAMESPACE,
    type: SettingType.text,
    value: 'gemini-1.5-flash',
  },
  {
    label: 'temperature',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0.8,
  },
  {
    label: 'candidate_count',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 1, // Default value (only value allowed is 1)
  },
  {
    label: 'max_output_tokens',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 1000, // Default value
  },
  {
    label: 'top_k',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 40, // Default value (can be adjusted as needed)
  },
  {
    label: 'top_p',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0.95, // Default value, range between 0.0 and 1.0
  },
  {
    label: 'presence_penalty',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0.0, // Default value, range between -2.0 and 2.0
  },
  {
    label: 'frequency_penalty',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0.0, // Default value, range between -2.0 and 2.0
  },
  {
    label: 'response_logprobs',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  {
    label: 'logprobs',
    group: GEMINI_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: null, // Default value (valid if response_logprobs is true, range between 0 and 20)
  },
] as const satisfies HelperSetting<typeof GEMINI_HELPER_NAME>[];
