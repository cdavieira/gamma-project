package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.EditionResultsAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.EditionResults;
import com.mycompany.myapp.domain.Participant;
import com.mycompany.myapp.repository.EditionResultsRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EditionResultsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EditionResultsResourceIT {

    private static final Integer DEFAULT_YEAR = 1998;
    private static final Integer UPDATED_YEAR = 1999;

    private static final String ENTITY_API_URL = "/api/edition-results";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EditionResultsRepository editionResultsRepository;

    @Mock
    private EditionResultsRepository editionResultsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEditionResultsMockMvc;

    private EditionResults editionResults;

    private EditionResults insertedEditionResults;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EditionResults createEntity(EntityManager em) {
        EditionResults editionResults = new EditionResults().year(DEFAULT_YEAR);
        // Add required entity
        Participant participant;
        if (TestUtil.findAll(em, Participant.class).isEmpty()) {
            participant = ParticipantResourceIT.createEntity();
            em.persist(participant);
            em.flush();
        } else {
            participant = TestUtil.findAll(em, Participant.class).get(0);
        }
        editionResults.setParticipant(participant);
        return editionResults;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EditionResults createUpdatedEntity(EntityManager em) {
        EditionResults updatedEditionResults = new EditionResults().year(UPDATED_YEAR);
        // Add required entity
        Participant participant;
        if (TestUtil.findAll(em, Participant.class).isEmpty()) {
            participant = ParticipantResourceIT.createUpdatedEntity();
            em.persist(participant);
            em.flush();
        } else {
            participant = TestUtil.findAll(em, Participant.class).get(0);
        }
        updatedEditionResults.setParticipant(participant);
        return updatedEditionResults;
    }

    @BeforeEach
    void initTest() {
        editionResults = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedEditionResults != null) {
            editionResultsRepository.delete(insertedEditionResults);
            insertedEditionResults = null;
        }
    }

    @Test
    @Transactional
    void createEditionResults() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the EditionResults
        var returnedEditionResults = om.readValue(
            restEditionResultsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editionResults)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            EditionResults.class
        );

        // Validate the EditionResults in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEditionResultsUpdatableFieldsEquals(returnedEditionResults, getPersistedEditionResults(returnedEditionResults));

        insertedEditionResults = returnedEditionResults;
    }

    @Test
    @Transactional
    void createEditionResultsWithExistingId() throws Exception {
        // Create the EditionResults with an existing ID
        editionResults.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEditionResultsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editionResults)))
            .andExpect(status().isBadRequest());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkYearIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        editionResults.setYear(null);

        // Create the EditionResults, which fails.

        restEditionResultsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editionResults)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEditionResults() throws Exception {
        // Initialize the database
        insertedEditionResults = editionResultsRepository.saveAndFlush(editionResults);

        // Get all the editionResultsList
        restEditionResultsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(editionResults.getId().intValue())))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEditionResultsWithEagerRelationshipsIsEnabled() throws Exception {
        when(editionResultsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEditionResultsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(editionResultsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEditionResultsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(editionResultsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEditionResultsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(editionResultsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getEditionResults() throws Exception {
        // Initialize the database
        insertedEditionResults = editionResultsRepository.saveAndFlush(editionResults);

        // Get the editionResults
        restEditionResultsMockMvc
            .perform(get(ENTITY_API_URL_ID, editionResults.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(editionResults.getId().intValue()))
            .andExpect(jsonPath("$.year").value(DEFAULT_YEAR));
    }

    @Test
    @Transactional
    void getNonExistingEditionResults() throws Exception {
        // Get the editionResults
        restEditionResultsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEditionResults() throws Exception {
        // Initialize the database
        insertedEditionResults = editionResultsRepository.saveAndFlush(editionResults);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the editionResults
        EditionResults updatedEditionResults = editionResultsRepository.findById(editionResults.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEditionResults are not directly saved in db
        em.detach(updatedEditionResults);
        updatedEditionResults.year(UPDATED_YEAR);

        restEditionResultsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEditionResults.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEditionResults))
            )
            .andExpect(status().isOk());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEditionResultsToMatchAllProperties(updatedEditionResults);
    }

    @Test
    @Transactional
    void putNonExistingEditionResults() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editionResults.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEditionResultsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, editionResults.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(editionResults))
            )
            .andExpect(status().isBadRequest());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEditionResults() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editionResults.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditionResultsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(editionResults))
            )
            .andExpect(status().isBadRequest());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEditionResults() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editionResults.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditionResultsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editionResults)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEditionResultsWithPatch() throws Exception {
        // Initialize the database
        insertedEditionResults = editionResultsRepository.saveAndFlush(editionResults);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the editionResults using partial update
        EditionResults partialUpdatedEditionResults = new EditionResults();
        partialUpdatedEditionResults.setId(editionResults.getId());

        partialUpdatedEditionResults.year(UPDATED_YEAR);

        restEditionResultsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEditionResults.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEditionResults))
            )
            .andExpect(status().isOk());

        // Validate the EditionResults in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEditionResultsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEditionResults, editionResults),
            getPersistedEditionResults(editionResults)
        );
    }

    @Test
    @Transactional
    void fullUpdateEditionResultsWithPatch() throws Exception {
        // Initialize the database
        insertedEditionResults = editionResultsRepository.saveAndFlush(editionResults);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the editionResults using partial update
        EditionResults partialUpdatedEditionResults = new EditionResults();
        partialUpdatedEditionResults.setId(editionResults.getId());

        partialUpdatedEditionResults.year(UPDATED_YEAR);

        restEditionResultsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEditionResults.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEditionResults))
            )
            .andExpect(status().isOk());

        // Validate the EditionResults in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEditionResultsUpdatableFieldsEquals(partialUpdatedEditionResults, getPersistedEditionResults(partialUpdatedEditionResults));
    }

    @Test
    @Transactional
    void patchNonExistingEditionResults() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editionResults.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEditionResultsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, editionResults.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(editionResults))
            )
            .andExpect(status().isBadRequest());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEditionResults() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editionResults.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditionResultsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(editionResults))
            )
            .andExpect(status().isBadRequest());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEditionResults() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editionResults.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditionResultsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(editionResults)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EditionResults in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEditionResults() throws Exception {
        // Initialize the database
        insertedEditionResults = editionResultsRepository.saveAndFlush(editionResults);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the editionResults
        restEditionResultsMockMvc
            .perform(delete(ENTITY_API_URL_ID, editionResults.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return editionResultsRepository.count();
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

    protected EditionResults getPersistedEditionResults(EditionResults editionResults) {
        return editionResultsRepository.findById(editionResults.getId()).orElseThrow();
    }

    protected void assertPersistedEditionResultsToMatchAllProperties(EditionResults expectedEditionResults) {
        assertEditionResultsAllPropertiesEquals(expectedEditionResults, getPersistedEditionResults(expectedEditionResults));
    }

    protected void assertPersistedEditionResultsToMatchUpdatableProperties(EditionResults expectedEditionResults) {
        assertEditionResultsAllUpdatablePropertiesEquals(expectedEditionResults, getPersistedEditionResults(expectedEditionResults));
    }
}
