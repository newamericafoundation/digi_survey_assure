import React from 'react';
import Api from '../../helpers/api';
import { translate } from '../../helpers/localize';
import { deleteItem } from '../../helpers/storage';

interface IProps {
    closeModal(): any;
    subsetId?: number;
    supersetId?: number;
    editing?: boolean;
}

export default abstract class BaseModal extends React.Component<IProps> {
    public maxSteps: number = 1;
    public baseState: any = {
        step: 1,
        error: null,
        loading: false,
        redirect: null,
    };
    public state: any;
    public deleteText: string = 'Please confirm deletion of this item. Note that this is irreversible.';

    abstract preview(): any;
    abstract step(stepNumber: number): any;
    abstract endpoint(): string;

    public validate(): boolean { return true; }

    public sendFields(): any {
        return this.state;
    }

    public handleInputChange(inputName: string, value: any) {
        const newState: any = {};

        newState[inputName] = value;

        this.setState(newState);
    }

    public moveStep(forward = true) {
        const currentStep = (forward) ? (this.state.step + 1) : (this.state.step - 1);

        // Note that maxSteps+1 = preview
        if (currentStep === this.maxSteps + 2) {
            this.save();
        } else if (currentStep <= 0) {
            this.props.closeModal();
        } else {
            this.setState({
                step: currentStep,
            });
        }
    }

    public confirmDelete() {
        if (window.confirm(this.deleteText)) {
            this.delete();
        } else {
            return false;
        }
    }

    public renderModal(title: string) {
        return (
            <div className="textLeft">
                <div className="modalUnderlay"></div>
                <div className="modal form">
                    {this.modalHeader(title)}

                    <div className="modalInternal">
                        {this.state.error && <div className="error">{this.state.error}</div>}
                        {this.renderStep()}
                        {this.state.error && <div className="error marginTop24 marginBottomNone">{this.state.error}</div>}
                    </div>

                    {this.modalFooter()}
                </div>
            </div>
        );
    }

    public get(forceEndpoint: string | null = null) {
        const endpoint = (forceEndpoint) ? forceEndpoint : this.buildEndpointStructure();

        return new Api(endpoint, 'get')
            .call()
            .then((response: any) => {
                return response;
            })
            .catch((e) => {
                this.processError(e);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    public delete() {
        return new Api(this.buildEndpointStructure(), 'delete')
            .secure()
            .call()
            .then((response: any) => {
                this.completeDelete();
            })
            .catch((e) => {
                this.processError(e);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    public completeDelete() {
        window.location.reload();
    }

    public save() {
        if (this.validate()) {
            this.setState({
                loading: true,
                error: '',
            });

            let method = 'post';
            let endpoint = this.endpoint();

            if (this.props.editing) {
                method = 'put';
                endpoint = `${endpoint}/${this.props.supersetId ? this.props.supersetId : this.props.subsetId}`;
            }

            new Api(endpoint, method)
                .setPayload(this.sendFields())
                .setTimeout(45000)
                .secure()
                .call()
                .then((response: any) => {
                    if (this.props.editing) {
                        this.completeEdit();
                    } else {
                        this.completeSave();
                    }
                })
                .catch((e: any) => {
                    this.processError(e);
                })
                .finally(() => {
                    this.setState({
                        loading: false,
                    });
                });
        }
    }

    public completeEdit() {
        window.location.reload();
    }

    public completeSave() {
        window.location.reload();
    }

    private buildEndpointStructure() {
        return `${this.endpoint()}/${this.props.supersetId ? this.props.supersetId : this.props.subsetId}`;
    }

    private processError(e: any) {
        if (e.httpCode === 401) {
            this.setState({
                error: translate('E031')
            });

            deleteItem('adminToken');
        }
        else {
            let message;
            if (!e.errorMessage) {
                message = translate(e.errorCode);
            } else {
                message = (typeof e.errorMessage === 'string')
                    ? e.errorMessage
                    : Object.keys(e.errorMessage).map((key) => { return <div key={key} className="errorEntry">{e.errorMessage[key].message}</div>; });
            }

            this.setState({
                error: message
            });
        }
    }

    private renderStep() {
        switch (this.state.step) {
            case this.maxSteps + 1:
                return this.preview();
            default:
                return this.step(this.state.step);
        }
    }

    private modalHeader(title: string) {
        return (
            <div className="modalHeader">
                <div className="closeModal" onClick={this.props.closeModal}>✖</div>
                <h1>{title}</h1>
            </div>
        );
    }

    private modalFooter() {
        let buttonWording = `${translate('next_step')} →`;
        if (this.state.loading) {
            buttonWording = translate('please_wait');
        } else if (this.state.step === this.maxSteps + 1) {
            buttonWording = translate('save');
        } else if (this.state.step === this.maxSteps) {
            buttonWording = translate('preview');
        }

        return (
            <div className="modelFooter">
                <div className="grid3Wrapper">
                    <div>
                        <button className="inactive" disabled={this.state.loading} onClick={(event) => this.moveStep(false)}>
                            {this.state.step === 1 && translate('cancel')}
                            {this.state.step !== 1 && `← ${translate('previous')}`}
                        </button>
                    </div>
                    <div className="textCenter">
                        {this.props.editing && <button className="deleteButton" disabled={this.state.loading} onClick={(event) => this.confirmDelete()}>
                            {translate('delete')}
                        </button>}
                    </div>
                    <div className="textRight">
                        <button className="active" disabled={this.state.loading} onClick={(event) => this.moveStep(true)}>
                            {buttonWording}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
