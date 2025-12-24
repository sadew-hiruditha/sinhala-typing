import { useMemo, useState } from "react";
import { useFeatureSupport } from "@canva/app-hooks";
import { Button, Rows, Text, Title, Select } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { FormattedMessage, useIntl } from "react-intl";
import {
  singlishToUnicode,
  unicodeToDlManel,
  dlManelToUnicode,
} from "sinhala-unicode-coverter";
import * as styles from "styles/components.css";

type InsertMode = "dl_manel_legacy" | "unicode";

export const App = () => {
  const intl = useIntl();
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const [roman, setRoman] = useState("");
  const [mode, setMode] = useState<InsertMode>("dl_manel_legacy");

  // Optional: if user pastes legacy text and wants to convert back to Unicode
  const [legacyInput, setLegacyInput] = useState("");

  const unicode = useMemo(() => singlishToUnicode(roman), [roman]);

  const legacyDlManel = useMemo(() => {
    // Convert the Unicode result into DL-Manel legacy encoding
    return unicodeToDlManel(unicode);
  }, [unicode]);

  const legacyToUnicode = useMemo(() => {
    if (!legacyInput.trim()) return "";
    return dlManelToUnicode(legacyInput);
  }, [legacyInput]);

  const insertText = () => {
    if (!addElement) return;

    const textToInsert =
      mode === "unicode" ? unicode.trim() : legacyDlManel.trim();

    if (!textToInsert) return;

    addElement({
      type: "text",
      children: [textToInsert],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <div>
        <Rows spacing="2u">
          <Title>
            {intl.formatMessage({
              defaultMessage: "Sinhala Typing (Phonetic)",
            })}
          </Title>

          <Text>
            <FormattedMessage
              defaultMessage="Type Singlish. We convert it to Sinhala. Choose how to insert into Canva."
            />
          </Text>

        <Rows spacing="1u">
          <Text>
            {intl.formatMessage({ defaultMessage: "Insert mode" })}
          </Text>
          <Select
            value={mode}
            onChange={(value) => setMode(value as InsertMode)}
            options={[
              {
                label: intl.formatMessage({
                  defaultMessage: "legacy (recommended)",
                }),
                
                value: "dl_manel_legacy",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Unicode ",
                }),
                value: "unicode",
              },
            ]}
          />
          
        </Rows>

        <Rows spacing="1u">
          <Text>{intl.formatMessage({ defaultMessage: "Singlish input" })}</Text>
          <textarea
            className={styles.modernInput}
            value={roman}
            onChange={(e) => setRoman(e.currentTarget.value)}
            rows={5}
            placeholder="shrii lankaawa..."
          />
        </Rows>

        <Rows spacing="1u">


          <Text>
            {intl.formatMessage({
              defaultMessage: "Unicode output",
            })}
          </Text>
          <div className={styles.modernPreview}>
            {legacyDlManel || "fmroiqk fuys Èiajkq we;'"}
          </div>



        </Rows>



        <Rows spacing="1u">
          <Button
            variant="primary"
            onClick={insertText}
            disabled={!addElement || !(mode === "unicode" ? unicode.trim() : legacyDlManel.trim())}
            stretch
          >
            {intl.formatMessage({ defaultMessage: "Insert into design" })}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setRoman("")}
            disabled={!roman}
            stretch
          >
            {intl.formatMessage({ defaultMessage: "Clear" })}
          </Button>
        </Rows>

       
      </Rows>
      </div>
    </div>
  );
};
