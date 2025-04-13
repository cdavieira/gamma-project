package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EditionResultsTestSamples.*;
import static com.mycompany.myapp.domain.ParticipantTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ParticipantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Participant.class);
        Participant participant1 = getParticipantSample1();
        Participant participant2 = new Participant();
        assertThat(participant1).isNotEqualTo(participant2);

        participant2.setId(participant1.getId());
        assertThat(participant1).isEqualTo(participant2);

        participant2 = getParticipantSample2();
        assertThat(participant1).isNotEqualTo(participant2);
    }

    @Test
    void resultTest() {
        Participant participant = getParticipantRandomSampleGenerator();
        EditionResults editionResultsBack = getEditionResultsRandomSampleGenerator();

        participant.addResult(editionResultsBack);
        assertThat(participant.getResults()).containsOnly(editionResultsBack);
        assertThat(editionResultsBack.getParticipant()).isEqualTo(participant);

        participant.removeResult(editionResultsBack);
        assertThat(participant.getResults()).doesNotContain(editionResultsBack);
        assertThat(editionResultsBack.getParticipant()).isNull();

        participant.results(new HashSet<>(Set.of(editionResultsBack)));
        assertThat(participant.getResults()).containsOnly(editionResultsBack);
        assertThat(editionResultsBack.getParticipant()).isEqualTo(participant);

        participant.setResults(new HashSet<>());
        assertThat(participant.getResults()).doesNotContain(editionResultsBack);
        assertThat(editionResultsBack.getParticipant()).isNull();
    }
}
