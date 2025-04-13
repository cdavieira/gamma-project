package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.GoalAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.EditionResults;
import com.mycompany.myapp.domain.Goal;
import com.mycompany.myapp.domain.enumeration.Subject;
import com.mycompany.myapp.repository.GoalRepository;
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
 * Integration tests for the {@link GoalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GoalResourceIT {

    private static final Integer DEFAULT_VALUE = 0;
    private static final Integer UPDATED_VALUE = 1;

    private static final Subject DEFAULT_SUBJECT = Subject.LINGUAGENS;
    private static final Subject UPDATED_SUBJECT = Subject.HUMANAS;

    private static final String ENTITY_API_URL = "/api/goals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGoalMockMvc;

    private Goal goal;

    private Goal insertedGoal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Goal createEntity(EntityManager em) {
        Goal goal = new Goal().value(DEFAULT_VALUE).subject(DEFAULT_SUBJECT);
        // Add required entity
        EditionResults editionResults;
        if (TestUtil.findAll(em, EditionResults.class).isEmpty()) {
            editionResults = EditionResultsResourceIT.createEntity(em);
            em.persist(editionResults);
            em.flush();
        } else {
            editionResults = TestUtil.findAll(em, EditionResults.class).get(0);
        }
        goal.setResult(editionResults);
        return goal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Goal createUpdatedEntity(EntityManager em) {
        Goal updatedGoal = new Goal().value(UPDATED_VALUE).subject(UPDATED_SUBJECT);
        // Add required entity
        EditionResults editionResults;
        if (TestUtil.findAll(em, EditionResults.class).isEmpty()) {
            editionResults = EditionResultsResourceIT.createUpdatedEntity(em);
            em.persist(editionResults);
            em.flush();
        } else {
            editionResults = TestUtil.findAll(em, EditionResults.class).get(0);
        }
        updatedGoal.setResult(editionResults);
        return updatedGoal;
    }

    @BeforeEach
    void initTest() {
        goal = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedGoal != null) {
            goalRepository.delete(insertedGoal);
            insertedGoal = null;
        }
    }

    @Test
    @Transactional
    void createGoal() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Goal
        var returnedGoal = om.readValue(
            restGoalMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(goal)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Goal.class
        );

        // Validate the Goal in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertGoalUpdatableFieldsEquals(returnedGoal, getPersistedGoal(returnedGoal));

        insertedGoal = returnedGoal;
    }

    @Test
    @Transactional
    void createGoalWithExistingId() throws Exception {
        // Create the Goal with an existing ID
        goal.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(goal)))
            .andExpect(status().isBadRequest());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        goal.setValue(null);

        // Create the Goal, which fails.

        restGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(goal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSubjectIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        goal.setSubject(null);

        // Create the Goal, which fails.

        restGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(goal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGoals() throws Exception {
        // Initialize the database
        insertedGoal = goalRepository.saveAndFlush(goal);

        // Get all the goalList
        restGoalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(goal.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT.toString())));
    }

    @Test
    @Transactional
    void getGoal() throws Exception {
        // Initialize the database
        insertedGoal = goalRepository.saveAndFlush(goal);

        // Get the goal
        restGoalMockMvc
            .perform(get(ENTITY_API_URL_ID, goal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(goal.getId().intValue()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGoal() throws Exception {
        // Get the goal
        restGoalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGoal() throws Exception {
        // Initialize the database
        insertedGoal = goalRepository.saveAndFlush(goal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the goal
        Goal updatedGoal = goalRepository.findById(goal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGoal are not directly saved in db
        em.detach(updatedGoal);
        updatedGoal.value(UPDATED_VALUE).subject(UPDATED_SUBJECT);

        restGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGoal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedGoal))
            )
            .andExpect(status().isOk());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGoalToMatchAllProperties(updatedGoal);
    }

    @Test
    @Transactional
    void putNonExistingGoal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        goal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGoalMockMvc
            .perform(put(ENTITY_API_URL_ID, goal.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(goal)))
            .andExpect(status().isBadRequest());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGoal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        goal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(goal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGoal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        goal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(goal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGoalWithPatch() throws Exception {
        // Initialize the database
        insertedGoal = goalRepository.saveAndFlush(goal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the goal using partial update
        Goal partialUpdatedGoal = new Goal();
        partialUpdatedGoal.setId(goal.getId());

        restGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGoal))
            )
            .andExpect(status().isOk());

        // Validate the Goal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGoalUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedGoal, goal), getPersistedGoal(goal));
    }

    @Test
    @Transactional
    void fullUpdateGoalWithPatch() throws Exception {
        // Initialize the database
        insertedGoal = goalRepository.saveAndFlush(goal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the goal using partial update
        Goal partialUpdatedGoal = new Goal();
        partialUpdatedGoal.setId(goal.getId());

        partialUpdatedGoal.value(UPDATED_VALUE).subject(UPDATED_SUBJECT);

        restGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGoal))
            )
            .andExpect(status().isOk());

        // Validate the Goal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGoalUpdatableFieldsEquals(partialUpdatedGoal, getPersistedGoal(partialUpdatedGoal));
    }

    @Test
    @Transactional
    void patchNonExistingGoal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        goal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGoalMockMvc
            .perform(patch(ENTITY_API_URL_ID, goal.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(goal)))
            .andExpect(status().isBadRequest());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGoal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        goal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(goal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGoal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        goal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(goal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Goal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGoal() throws Exception {
        // Initialize the database
        insertedGoal = goalRepository.saveAndFlush(goal);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the goal
        restGoalMockMvc
            .perform(delete(ENTITY_API_URL_ID, goal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return goalRepository.count();
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

    protected Goal getPersistedGoal(Goal goal) {
        return goalRepository.findById(goal.getId()).orElseThrow();
    }

    protected void assertPersistedGoalToMatchAllProperties(Goal expectedGoal) {
        assertGoalAllPropertiesEquals(expectedGoal, getPersistedGoal(expectedGoal));
    }

    protected void assertPersistedGoalToMatchUpdatableProperties(Goal expectedGoal) {
        assertGoalAllUpdatablePropertiesEquals(expectedGoal, getPersistedGoal(expectedGoal));
    }
}
