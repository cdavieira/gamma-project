package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ScoreAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.EditionResults;
import com.mycompany.myapp.domain.Score;
import com.mycompany.myapp.domain.enumeration.Subject;
import com.mycompany.myapp.repository.ScoreRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ScoreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ScoreResourceIT {

    private static final Integer DEFAULT_VALUE = 0;
    private static final Integer UPDATED_VALUE = 1;

    private static final Subject DEFAULT_SUBJECT = Subject.LINGUAGENS;
    private static final Subject UPDATED_SUBJECT = Subject.HUMANAS;

    private static final String ENTITY_API_URL = "/api/scores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScoreMockMvc;

    private Score score;

    private Score insertedScore;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Score createEntity(EntityManager em) {
        Score score = new Score().value(DEFAULT_VALUE).subject(DEFAULT_SUBJECT);
        // Add required entity
        EditionResults editionResults;
        if (TestUtil.findAll(em, EditionResults.class).isEmpty()) {
            editionResults = EditionResultsResourceIT.createEntity(em);
            em.persist(editionResults);
            em.flush();
        } else {
            editionResults = TestUtil.findAll(em, EditionResults.class).get(0);
        }
        score.setResult(editionResults);
        return score;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Score createUpdatedEntity(EntityManager em) {
        Score updatedScore = new Score().value(UPDATED_VALUE).subject(UPDATED_SUBJECT);
        // Add required entity
        EditionResults editionResults;
        if (TestUtil.findAll(em, EditionResults.class).isEmpty()) {
            editionResults = EditionResultsResourceIT.createUpdatedEntity(em);
            em.persist(editionResults);
            em.flush();
        } else {
            editionResults = TestUtil.findAll(em, EditionResults.class).get(0);
        }
        updatedScore.setResult(editionResults);
        return updatedScore;
    }

    @BeforeEach
    void initTest() {
        score = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedScore != null) {
            scoreRepository.delete(insertedScore);
            insertedScore = null;
        }
    }

    @Test
    @Transactional
    void createScore() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Score
        var returnedScore = om.readValue(
            restScoreMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(score)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Score.class
        );

        // Validate the Score in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertScoreUpdatableFieldsEquals(returnedScore, getPersistedScore(returnedScore));

        insertedScore = returnedScore;
    }

    @Test
    @Transactional
    void createScoreWithExistingId() throws Exception {
        // Create the Score with an existing ID
        score.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(score)))
            .andExpect(status().isBadRequest());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        score.setValue(null);

        // Create the Score, which fails.

        restScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(score)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSubjectIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        score.setSubject(null);

        // Create the Score, which fails.

        restScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(score)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllScores() throws Exception {
        // Initialize the database
        insertedScore = scoreRepository.saveAndFlush(score);

        // Get all the scoreList
        restScoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(score.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT.toString())));
    }

    @Test
    @Transactional
    void getScore() throws Exception {
        // Initialize the database
        insertedScore = scoreRepository.saveAndFlush(score);

        // Get the score
        restScoreMockMvc
            .perform(get(ENTITY_API_URL_ID, score.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(score.getId().intValue()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingScore() throws Exception {
        // Get the score
        restScoreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingScore() throws Exception {
        // Initialize the database
        insertedScore = scoreRepository.saveAndFlush(score);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the score
        Score updatedScore = scoreRepository.findById(score.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedScore are not directly saved in db
        em.detach(updatedScore);
        updatedScore.value(UPDATED_VALUE).subject(UPDATED_SUBJECT);

        restScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedScore))
            )
            .andExpect(status().isOk());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedScoreToMatchAllProperties(updatedScore);
    }

    @Test
    @Transactional
    void putNonExistingScore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        score.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScoreMockMvc
            .perform(put(ENTITY_API_URL_ID, score.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(score)))
            .andExpect(status().isBadRequest());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        score.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(score))
            )
            .andExpect(status().isBadRequest());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        score.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScoreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(score)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScoreWithPatch() throws Exception {
        // Initialize the database
        insertedScore = scoreRepository.saveAndFlush(score);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the score using partial update
        Score partialUpdatedScore = new Score();
        partialUpdatedScore.setId(score.getId());

        restScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedScore))
            )
            .andExpect(status().isOk());

        // Validate the Score in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertScoreUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedScore, score), getPersistedScore(score));
    }

    @Test
    @Transactional
    void fullUpdateScoreWithPatch() throws Exception {
        // Initialize the database
        insertedScore = scoreRepository.saveAndFlush(score);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the score using partial update
        Score partialUpdatedScore = new Score();
        partialUpdatedScore.setId(score.getId());

        partialUpdatedScore.value(UPDATED_VALUE).subject(UPDATED_SUBJECT);

        restScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedScore))
            )
            .andExpect(status().isOk());

        // Validate the Score in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertScoreUpdatableFieldsEquals(partialUpdatedScore, getPersistedScore(partialUpdatedScore));
    }

    @Test
    @Transactional
    void patchNonExistingScore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        score.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, score.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(score))
            )
            .andExpect(status().isBadRequest());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        score.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(score))
            )
            .andExpect(status().isBadRequest());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        score.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScoreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(score)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Score in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScore() throws Exception {
        // Initialize the database
        insertedScore = scoreRepository.saveAndFlush(score);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the score
        restScoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, score.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return scoreRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Score getPersistedScore(Score score) {
        return scoreRepository.findById(score.getId()).orElseThrow();
    }

    protected void assertPersistedScoreToMatchAllProperties(Score expectedScore) {
        assertScoreAllPropertiesEquals(expectedScore, getPersistedScore(expectedScore));
    }

    protected void assertPersistedScoreToMatchUpdatableProperties(Score expectedScore) {
        assertScoreAllUpdatablePropertiesEquals(expectedScore, getPersistedScore(expectedScore));
    }
}
