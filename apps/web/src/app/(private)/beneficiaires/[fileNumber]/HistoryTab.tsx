import { LabelAndValue } from '@mss/web/ui/LabelAndValue'
import { getUserDisplayName } from '@mss/web/utils/user'
import { SessionUser } from '@mss/web/auth/sessionUser'
import type { BeneficiaryPageSupport } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'

export const HistoryTab = ({
  user,
  supports,
}: {
  user: SessionUser
  supports: BeneficiaryPageSupport[]
}) => {
  return (
    <>
      <h4>Historique</h4>

      <div>
        {/* TODO use security rules instead of inlining security decisions with conditions*/}
        {supports.map((support) => {
          return (
            <div key={support.id} className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-2 fr-text-label--blue-france fr-text--bold">
                {support.historyDate.toLocaleDateString()}
              </div>
              <div className="fr-col-12 fr-col-md-10">
                <div className="fr-card">
                  <div className="fr-card__body fr-px-4w">
                    <div className="fr-card__content fr-py-4v">
                      <div className="fr-grid-row">
                        <div className="fr-col-12 fr-col-md-8">
                          <ul className="fr-raw-list">
                            <LabelAndValue
                              value={
                                support.__type === 'helpRequest'
                                  ? "Demande d'aide"
                                  : 'Entretien'
                              }
                            >
                              Type
                            </LabelAndValue>
                            <LabelAndValue value={support.type.name}>
                              Accompagnement
                            </LabelAndValue>
                            <LabelAndValue value={support.status}>
                              Statut
                            </LabelAndValue>

                            {support.__type === 'followup' ? (
                              <>
                                <LabelAndValue value={support.organisationName}>
                                  Redirigé vers
                                </LabelAndValue>
                              </>
                            ) : null}
                            {support.__type === 'helpRequest' ? (
                              <>
                                <LabelAndValue
                                  value={
                                    support.financialSupport ? 'Oui' : 'Non'
                                  }
                                >
                                  Demande financière
                                </LabelAndValue>
                              </>
                            ) : null}
                          </ul>
                        </div>
                        <div
                          className={`fr-col-12 fr-col-md-4 fr-text--bold ${
                            support.createdById === user.id
                              ? 'fr-text-label--blue-france'
                              : null
                          }`}
                        >
                          {support.createdBy
                            ? getUserDisplayName(support.createdBy)
                            : 'Système'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
