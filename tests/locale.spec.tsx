import { render } from '@testing-library/react';
import Calendar from '../src/Calendar';

import ar_EG from '../src/locale/ar_EG';
import bg_BG from '../src/locale/bg_BG';
import ca_ES from '../src/locale/ca_ES';
import cs_CZ from '../src/locale/cs_CZ';
import da_DK from '../src/locale/da_DK';
import de_DE from '../src/locale/de_DE';
import el_GR from '../src/locale/el_GR';
import en_GB from '../src/locale/en_GB';
import en_US from '../src/locale/en_US';
import es_ES from '../src/locale/es_ES';
import et_EE from '../src/locale/et_EE';
import fa_IR from '../src/locale/fa_IR';
import fi_FI from '../src/locale/fi_FI';
import fr_BE from '../src/locale/fr_BE';
import fr_FR from '../src/locale/fr_FR';
import hu_HU from '../src/locale/hu_HU';
import is_IS from '../src/locale/is_IS';
import it_IT from '../src/locale/it_IT';
import ja_JP from '../src/locale/ja_JP';
import ko_KR from '../src/locale/ko_KR';
import ku_IQ from '../src/locale/ku_IQ';
import nb_NO from '../src/locale/nb_NO';
import nl_BE from '../src/locale/nl_BE';
import nl_NL from '../src/locale/nl_NL';
import pl_PL from '../src/locale/pl_PL';
import pt_BR from '../src/locale/pt_BR';
import pt_PT from '../src/locale/pt_PT';
import ru_RU from '../src/locale/ru_RU';
import sk_SK from '../src/locale/sk_SK';
import sr_RS from '../src/locale/sr_RS';
import sl_SI from '../src/locale/sl_SI';
import sv_SE from '../src/locale/sv_SE';
import th_TH from '../src/locale/th_TH';
import tr_TR from '../src/locale/tr_TR';
import ug_CN from '../src/locale/ug_CN';
import uk_UA from '../src/locale/uk_UA';
import vi_VN from '../src/locale/vi_VN';
import zh_CN from '../src/locale/zh_CN';
import zh_TW from '../src/locale/zh_TW';
import { describe } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';

const locales = {
  ar_EG,
  bg_BG,
  ca_ES,
  cs_CZ,
  da_DK,
  de_DE,
  el_GR,
  en_GB,
  en_US,
  es_ES,
  et_EE,
  fa_IR,
  fi_FI,
  fr_BE,
  fr_FR,
  hu_HU,
  is_IS,
  it_IT,
  ja_JP,
  ko_KR,
  ku_IQ,
  nb_NO,
  nl_BE,
  nl_NL,
  pl_PL,
  pt_BR,
  pt_PT,
  ru_RU,
  sk_SK,
  sr_RS,
  sl_SI,
  sv_SE,
  th_TH,
  tr_TR,
  ug_CN,
  uk_UA,
  vi_VN,
  zh_CN,
  zh_TW,
};

describe('locales', () => {
  Object.keys(locales).forEach((localeCode) => {
    it(`renders ${localeCode} correctly`, () => {
      const { container } = render(<Calendar locale={locales[localeCode]} />);
      expect(container).toMatchSnapshot();
    });
  });
});
