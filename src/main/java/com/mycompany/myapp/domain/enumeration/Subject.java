package com.mycompany.myapp.domain.enumeration;

/**
 * The Subject enumeration.
 */
public enum Subject {
    LINGUAGENS("Linguages"),
    HUMANAS("Humanas"),
    NATUREZA("Natureza"),
    MATEMATICA("Matematica");

    private final String value;

    Subject(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
